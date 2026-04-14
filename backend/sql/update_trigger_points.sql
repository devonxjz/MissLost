-- ============================================================
--  CẬP NHẬT: Đổi điểm thưởng từ 10 → 5 (chỉ cộng cho FINDER)
--  Chạy file này trên Supabase SQL Editor
-- ============================================================

-- Cập nhật default points_awarded trong bảng triggers
ALTER TABLE triggers ALTER COLUMN points_awarded SET DEFAULT 5;

-- Tạo lại function confirm_trigger — cộng 5 điểm CHỈ cho FINDER (người nhặt được)
CREATE OR REPLACE FUNCTION confirm_trigger(
    p_trigger_id UUID,
    p_user_id    UUID
) RETURNS JSONB AS $$
DECLARE
    v_trigger         triggers%ROWTYPE;
    v_points          INT;
    v_finder_balance  INT;
    v_finder_id       UUID;
    v_loser_id        UUID;
    v_finder_name     TEXT;
    v_finder_status   TEXT;
    v_post_title      TEXT;
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

    -- Lấy tên bài đăng
    IF v_trigger.post_type = 'found' THEN
        SELECT title INTO v_post_title FROM found_posts WHERE id = v_trigger.post_id;
    ELSE
        SELECT title INTO v_post_title FROM lost_posts WHERE id = v_trigger.post_id;
    END IF;

    v_points := v_trigger.points_awarded;

    -- Đánh dấu trigger đã xác nhận
    UPDATE triggers
    SET status = 'confirmed', confirmed_at = NOW()
    WHERE id = p_trigger_id;

    -- ═══════════════════════════════════════════
    -- CỘNG ĐIỂM CHỈ CHO FINDER (người nhặt được)
    -- ═══════════════════════════════════════════
    SELECT full_name INTO v_finder_name FROM users WHERE id = v_finder_id;

    UPDATE users
    SET training_points = training_points + v_points
    WHERE id = v_finder_id
    RETURNING training_points INTO v_finder_balance;

    INSERT INTO training_point_logs (user_id, points_delta, reason, balance_after)
    VALUES (
        v_finder_id,
        v_points,
        'Trao trả thành công: "' || COALESCE(v_post_title, 'Không rõ') || '"',
        v_finder_balance
    );

    -- Thông báo cho finder (người nhặt được)
    INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id)
    VALUES (
        v_finder_id,
        'points_awarded',
        'Bạn được cộng ' || v_points || ' điểm rèn luyện!',
        'Ghi nhận hành động tốt đẹp của bạn khi trao trả "' || COALESCE(v_post_title, 'vật phẩm') || '" thành công.',
        'trigger',
        p_trigger_id
    );

    -- Thông báo cho loser (người nhận lại đồ) — không cộng điểm
    INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id)
    VALUES (
        v_loser_id,
        'handover_completed',
        'Cảm ơn bạn đã xác nhận!',
        v_finder_name || ' đã được ghi nhận trao trả "' || COALESCE(v_post_title, 'vật phẩm') || '" thành công.',
        'trigger',
        p_trigger_id
    );

    -- Đóng bài đăng
    IF v_trigger.post_type = 'found' THEN
        UPDATE found_posts SET status = 'closed' WHERE id = v_trigger.post_id;
    ELSE
        UPDATE lost_posts SET status = 'closed' WHERE id = v_trigger.post_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'trigger_id', p_trigger_id,
        'points_awarded', v_points,
        'finder_balance', v_finder_balance
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'Lỗi hệ thống: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql;
