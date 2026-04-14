-- Kích hoạt extension bắt buộc cho uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
--  CLEANUP — Xóa các hàm, bảng và type cũ trước khi tạo mới
-- ============================================================

DROP FUNCTION IF EXISTS create_trigger(UUID, post_type_enum, UUID, UUID, UUID, INT) CASCADE;
DROP FUNCTION IF EXISTS confirm_trigger(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS cancel_trigger(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS auto_expire_triggers() CASCADE;

DROP TABLE IF EXISTS triggers CASCADE;

DROP TYPE IF EXISTS trigger_status CASCADE;
-- Bỏ qua không xóa type cũ để tránh mất data
-- DROP TYPE IF EXISTS post_type_enum CASCADE;


-- ============================================================
--  TRIGGERS SYSTEM
-- ============================================================

-- 1. ENUM types
CREATE TYPE trigger_status AS ENUM ('pending', 'confirmed', 'expired', 'cancelled');

-- [ĐÃ FIX LỖI 42710]: Comment lại vì DB của bạn ĐÃ CÓ type này rồi
-- CREATE TYPE post_type_enum AS ENUM ('found', 'lost');

-- 2. Bảng triggers
CREATE TABLE triggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL,
    post_type post_type_enum NOT NULL DEFAULT 'found',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    finder_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id),
    status trigger_status NOT NULL DEFAULT 'pending',
    points_awarded INT NOT NULL DEFAULT 10,
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '48 hours',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (created_by <> target_user_id)
);

-- 3. Indexes
CREATE UNIQUE INDEX idx_unique_active_trigger
    ON triggers(post_id, post_type)
    WHERE status = 'pending';

CREATE INDEX idx_triggers_target_user  ON triggers(target_user_id, status);
CREATE INDEX idx_triggers_created_by   ON triggers(created_by);
CREATE INDEX idx_triggers_conversation ON triggers(conversation_id, status);
CREATE INDEX idx_triggers_expires      ON triggers(expires_at) WHERE status = 'pending';


-- ============================================================
--  FUNCTION: create_trigger
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
    v_post_check    UUID;
    v_post_title    TEXT;
    v_finder_name   TEXT;
    v_finder_id     UUID;
    v_post_status   TEXT;
    v_post_owner    UUID;
BEGIN
    IF p_created_by = p_target_user THEN
        RETURN jsonb_build_object('success', false, 'error', 'Không thể tạo trigger cho chính mình');
    END IF;

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

    IF v_post_owner <> p_created_by AND v_post_owner <> p_target_user THEN
        RETURN jsonb_build_object('success', false, 'error', 'Không ai trong cuộc hội thoại là chủ bài đăng này');
    END IF;

    IF v_post_status NOT IN ('approved', 'matched') THEN
        RETURN jsonb_build_object('success', false, 'error',
            'Bài đăng đang ở trạng thái "' || v_post_status || '", chỉ có thể tạo trigger cho bài đã duyệt');
    END IF;

    SELECT full_name INTO v_finder_name FROM users WHERE id = p_created_by;

    IF p_post_type = 'found' THEN
        v_finder_id := v_post_owner;
    ELSE
        IF v_post_owner = p_created_by THEN
            v_finder_id := p_target_user;
        ELSE
            v_finder_id := p_created_by;
        END IF;
    END IF;

    INSERT INTO triggers (post_id, post_type, created_by, target_user_id, finder_user_id, conversation_id, points_awarded)
    VALUES (p_post_id, p_post_type, p_created_by, p_target_user, v_finder_id, p_conversation, p_points)
    RETURNING id INTO v_trigger_id;

    INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id)
    VALUES (
        p_target_user,
        'handover_request',
        'Yêu cầu xác nhận nhận đồ',
        v_finder_name || ' xác nhận đây là đồ của bạn. Vào chat để xác nhận nhận đồ.',
        'trigger',
        v_trigger_id
    );

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
--  FUNCTION: confirm_trigger
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

    v_finder_id := v_trigger.finder_user_id;
    v_loser_id  := CASE 
        WHEN v_trigger.post_type = 'found' THEN v_trigger.target_user_id
        ELSE v_trigger.created_by
    END;

    SELECT status INTO v_finder_status FROM users WHERE id = v_finder_id;
    IF v_finder_status = 'suspended' THEN
        UPDATE triggers SET status = 'expired' WHERE id = p_trigger_id;
        RETURN jsonb_build_object('success', false, 'error',
            'Người nhặt đồ đã bị khóa tài khoản. Vui lòng liên hệ admin.');
    END IF;

    v_points := v_trigger.points_awarded;

    UPDATE triggers
    SET status = 'confirmed', confirmed_at = NOW()
    WHERE id = p_trigger_id;

    UPDATE users
    SET training_points = training_points + v_points
    WHERE id = v_finder_id
    RETURNING training_points INTO v_balance;

    INSERT INTO training_point_logs (user_id, points_delta, reason, balance_after)
    VALUES (
        v_finder_id,
        v_points,
        'Trao trả đồ thành công qua trigger #' || p_trigger_id::TEXT,
        v_balance
    );

    SELECT full_name INTO v_finder_name FROM users WHERE id = v_finder_id;

    INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id)
    VALUES (
        v_finder_id,
        'points_awarded',
        'Bạn được cộng ' || v_points || ' điểm rèn luyện!',
        'Hệ thống ghi nhận sự giúp đỡ của bạn vì quá trình trao trả đồ thành công.',
        'trigger',
        p_trigger_id
    );

    INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id)
    VALUES (
        v_loser_id,
        'handover_completed',
        'Cảm ơn bạn đã xác nhận!',
        v_finder_name || ' đã được ghi nhận trao trả thành công.',
        'trigger',
        p_trigger_id
    );

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

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'Lỗi hệ thống: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql;


-- ============================================================
--  FUNCTION: cancel_trigger
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

    IF v_trigger.expires_at < NOW() THEN
        UPDATE triggers SET status = 'expired' WHERE id = p_trigger_id;
        RETURN jsonb_build_object('success', false, 'error', 'Trigger đã hết hạn');
    END IF;

    UPDATE triggers
    SET status = 'cancelled', cancelled_at = NOW()
    WHERE id = p_trigger_id;

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
--  FUNCTION: auto_expire_triggers
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

ALTER PUBLICATION supabase_realtime ADD TABLE triggers;