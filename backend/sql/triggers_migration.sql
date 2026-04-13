-- ============================================================
--  TRIGGERS SYSTEM — Xác nhận trao trả đơn giản qua chat
--  Chạy file này trên Supabase SQL Editor
-- ============================================================

-- 1. ENUM types
CREATE TYPE trigger_status AS ENUM ('pending', 'confirmed', 'expired', 'cancelled');
CREATE TYPE post_type_enum AS ENUM ('found', 'lost');

-- 2. Bảng triggers
CREATE TABLE triggers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- [NOTE] Polymorphic association: Thuộc tính này trỏ tới 'found_posts' hoặc 'lost_posts' tùy vào 'post_type'. Sẽ kiểm tra thủ công trong logic hàm 'create_trigger'.
    post_id         UUID            NOT NULL,
    post_type       post_type_enum  NOT NULL DEFAULT 'found',
    created_by      UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_user_id  UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    finder_user_id  UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID            REFERENCES conversations(id),

    status          trigger_status  NOT NULL DEFAULT 'pending',
    points_awarded  INT             NOT NULL DEFAULT 10,

    confirmed_at    TIMESTAMPTZ,
    cancelled_at    TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW() + INTERVAL '48 hours',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CHECK (created_by <> target_user_id)
);

-- 3. Partial unique index — chỉ 1 trigger pending per post
CREATE UNIQUE INDEX idx_unique_active_trigger
    ON triggers(post_id, post_type)
    WHERE status = 'pending';

CREATE INDEX idx_triggers_target_user  ON triggers(target_user_id, status);
CREATE INDEX idx_triggers_created_by   ON triggers(created_by);
CREATE INDEX idx_triggers_conversation ON triggers(conversation_id, status);
CREATE INDEX idx_triggers_expires      ON triggers(expires_at) WHERE status = 'pending';


-- ============================================================
--  FUNCTION: create_trigger — atomic create + notification
-- ============================================================

CREATE OR REPLACE FUNCTION create_trigger(
    p_post_id       UUID,
    p_post_type     post_type_enum,
    p_created_by    UUID,
    p_target_user   UUID,
    p_conversation  UUID DEFAULT NULL,
    p_points        INT DEFAULT 10
) RETURNS JSONB AS $$
DECLARE
    v_trigger_id    UUID;
    v_post_check    UUID;       -- [FIX #1] Biến riêng cho check post
    v_post_title    TEXT;
    v_finder_name   TEXT;
    v_finder_id     UUID;
    v_post_status   TEXT;
    v_post_owner    UUID;
BEGIN
    -- Validate: không tự gửi cho mình
    IF p_created_by = p_target_user THEN
        RETURN jsonb_build_object('success', false, 'error', 'Không thể tạo trigger cho chính mình');
    END IF;

    -- Validate: kiểm tra bài post tồn tại, đúng chủ, và trạng thái hợp lệ
    IF p_post_type = 'found' THEN
        SELECT id, title, status::TEXT, user_id
        INTO v_post_check, v_post_title, v_post_status, v_post_owner
        FROM found_posts WHERE id = p_post_id;
    ELSE
        SELECT id, title, status::TEXT, user_id
        INTO v_post_check, v_post_title, v_post_status, v_post_owner
        FROM lost_posts WHERE id = p_post_id;
    END IF;

    IF v_post_check IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Bài đăng không tồn tại');
    END IF;

    IF v_post_owner <> p_created_by THEN
        RETURN jsonb_build_object('success', false, 'error', 'Bạn không phải chủ bài đăng này');
    END IF;

    -- [FIX #2] Chỉ cho phép tạo trigger khi post đang approved hoặc matched
    IF v_post_status NOT IN ('approved', 'matched') THEN
        RETURN jsonb_build_object('success', false, 'error',
            'Bài đăng đang ở trạng thái "' || v_post_status || '", chỉ có thể tạo trigger cho bài đã duyệt');
    END IF;

    -- Lấy tên finder
    SELECT full_name INTO v_finder_name FROM users WHERE id = p_created_by;

    -- [FIX #1] Xác định ai là người nhặt (Finder) để cộng điểm
    IF p_post_type = 'found' THEN
        v_finder_id := p_created_by;  -- Người nhặt cũng chính là người đăng bài Found
    ELSE
        v_finder_id := p_target_user; -- Người đăng bài Lost (Mất đồ), người nhặt là người đang chat cùng (target)
    END IF;

    -- Insert trigger (partial unique index sẽ chặn nếu đã có pending trigger)
    INSERT INTO triggers (post_id, post_type, created_by, target_user_id, finder_user_id, conversation_id, points_awarded)
    VALUES (p_post_id, p_post_type, p_created_by, p_target_user, v_finder_id, p_conversation, p_points)
    RETURNING id INTO v_trigger_id;

    -- Tạo notification cho target user (atomic — cùng transaction)
    INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id)
    VALUES (
        p_target_user,
        'handover_request',
        'Yêu cầu xác nhận nhận đồ',
        v_finder_name || ' xác nhận đây là đồ của bạn. Vào chat để xác nhận nhận đồ.',
        'trigger',
        v_trigger_id
    );
    -- TODO: Cân nhắc chuyển phần tạo notification này lên Backend xử lý để hỗ trợ đa ngôn ngữ tốt hơn.

    RETURN jsonb_build_object(
        'success', true,
        'trigger_id', v_trigger_id,
        'post_title', v_post_title,
        'expires_at', (NOW() + INTERVAL '48 hours')::TEXT
    );

EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object('success', false, 'error', 'Đã có yêu cầu xác nhận đang chờ cho bài đăng này');
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'Lỗi hệ thống: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql;


-- ============================================================
--  FUNCTION: confirm_trigger — atomic confirm + cộng điểm
-- ============================================================

CREATE OR REPLACE FUNCTION confirm_trigger(
    p_trigger_id UUID,
    p_user_id    UUID
) RETURNS JSONB AS $$
DECLARE
    v_trigger       triggers%ROWTYPE;
    v_points        INT;
    v_balance       INT;
    v_finder_id     UUID;
    v_loser_id      UUID;
    v_finder_name   TEXT;
    v_finder_status TEXT;
BEGIN
    -- Step 1: Lock row (SELECT FOR UPDATE prevents race condition)
    SELECT * INTO v_trigger
    FROM triggers
    WHERE id = p_trigger_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Trigger không tồn tại');
    END IF;

    IF v_trigger.target_user_id <> p_user_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Bạn không có quyền xác nhận trigger này');
    END IF;

    IF v_trigger.status <> 'pending' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Trigger đã được xử lý: ' || v_trigger.status::TEXT);
    END IF;

    IF v_trigger.expires_at < NOW() THEN
        UPDATE triggers SET status = 'expired' WHERE id = p_trigger_id;
        RETURN jsonb_build_object('success', false, 'error', 'Trigger đã hết hạn');
    END IF;

    -- Xác định ai là Finder (nhặt) và Loser (mất) dựa vào dữ liệu đã lưu
    v_finder_id := v_trigger.finder_user_id;
    v_loser_id  := CASE 
        WHEN v_trigger.post_type = 'found' THEN v_trigger.target_user_id
        ELSE v_trigger.created_by
    END;

    -- [FIX #3] Check Finder bị ban → set expired thay vì confirmed, để admin xử lý
    SELECT status INTO v_finder_status FROM users WHERE id = v_finder_id;
    IF v_finder_status = 'suspended' THEN
        UPDATE triggers SET status = 'expired' WHERE id = p_trigger_id;
        RETURN jsonb_build_object('success', false, 'error',
            'Người nhặt đồ đã bị khóa tài khoản. Vui lòng liên hệ admin.');
    END IF;

    v_points := v_trigger.points_awarded;

    -- Step 2: Update trigger
    UPDATE triggers
    SET status = 'confirmed', confirmed_at = NOW()
    WHERE id = p_trigger_id;

    -- Step 3: Cộng điểm cho FINDER
    UPDATE users
    SET training_points = training_points + v_points
    WHERE id = v_finder_id
    RETURNING training_points INTO v_balance;

    -- Step 4: Audit log
    INSERT INTO training_point_logs (user_id, points_delta, reason, balance_after)
    VALUES (
        v_finder_id,
        v_points,
        'Trao trả đồ thành công qua trigger #' || p_trigger_id::TEXT,
        v_balance
    );

    -- Step 5: Tên Finder cho notification
    SELECT full_name INTO v_finder_name FROM users WHERE id = v_finder_id;

    -- Step 6: Notification cho Finder
    INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id)
    VALUES (
        v_finder_id,
        'points_awarded',
        'Bạn được cộng ' || v_points || ' điểm rèn luyện!',
        'Hệ thống ghi nhận sự giúp đỡ của bạn vì quá trình trao trả đồ thành công.',
        'trigger',
        p_trigger_id
    );

    -- Step 7: Notification cho Loser
    INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id)
    VALUES (
        v_loser_id,
        'handover_completed',
        'Cảm ơn bạn đã xác nhận!',
        v_finder_name || ' đã được ghi nhận trao trả thành công.',
        'trigger',
        p_trigger_id
    );

    -- Step 8: Close post
    IF v_trigger.post_type = 'found' THEN
        UPDATE found_posts SET status = 'closed' WHERE id = v_trigger.post_id;
    ELSE
        UPDATE lost_posts SET status = 'closed' WHERE id = v_trigger.post_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'trigger_id', p_trigger_id,
        'points_awarded', v_points,
        'finder_balance', v_balance
    );

-- [FIX #5] Exception handler cho confirm
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'Lỗi hệ thống: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql;


-- ============================================================
--  FUNCTION: cancel_trigger — Finder hủy + notification
-- ============================================================

CREATE OR REPLACE FUNCTION cancel_trigger(
    p_trigger_id UUID,
    p_user_id    UUID
) RETURNS JSONB AS $$
DECLARE
    v_trigger     triggers%ROWTYPE;
    v_finder_name TEXT;
BEGIN
    SELECT * INTO v_trigger
    FROM triggers
    WHERE id = p_trigger_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Trigger không tồn tại');
    END IF;

    IF v_trigger.created_by <> p_user_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Bạn không có quyền hủy trigger này');
    END IF;

    IF v_trigger.status <> 'pending' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Trigger đã được xử lý: ' || v_trigger.status::TEXT);
    END IF;

    -- [FIX/NEW] Kiểm tra hết hạn giống confirm_trigger
    IF v_trigger.expires_at < NOW() THEN
        UPDATE triggers SET status = 'expired' WHERE id = p_trigger_id;
        RETURN jsonb_build_object('success', false, 'error', 'Trigger đã hết hạn');
    END IF;

    -- Cancel trigger
    UPDATE triggers
    SET status = 'cancelled', cancelled_at = NOW()
    WHERE id = p_trigger_id;

    -- Notification cho target user
    SELECT full_name INTO v_finder_name FROM users WHERE id = p_user_id;

    INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id)
    VALUES (
        v_trigger.target_user_id,
        'system',
        'Yêu cầu xác nhận đã bị hủy',
        v_finder_name || ' đã hủy yêu cầu xác nhận trao trả.',
        'trigger',
        p_trigger_id
    );

    RETURN jsonb_build_object('success', true, 'trigger_id', p_trigger_id);

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'Lỗi hệ thống: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql;


-- ============================================================
--  [FIX #4] FUNCTION: auto_expire_triggers — Dành cho hệ thống quét (pg_cron hoặc Backend worker)
-- ============================================================

CREATE OR REPLACE FUNCTION auto_expire_triggers() RETURNS INT AS $$
DECLARE
    v_count INT;
BEGIN
    UPDATE triggers
    SET status = 'expired'
    WHERE status = 'pending' AND expires_at < NOW();
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
--  [FIX #4] KHÔNG dùng RLS với auth.uid() vì app dùng NestJS JWT
--  Backend dùng service_role key (bypass RLS).
--  Realtime sẽ dùng polling qua API thay vì subscribe trực tiếp.
-- ============================================================

-- Bật Supabase Realtime cho bảng triggers (vẫn hoạt động cho service_role)
ALTER PUBLICATION supabase_realtime ADD TABLE triggers;