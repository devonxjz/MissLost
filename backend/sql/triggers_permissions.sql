-- ============================================================
--  FIX: Cấp quyền cho bảng triggers trên Supabase
--  Chạy script này trên Supabase SQL Editor
-- ============================================================

-- 1. Bật Row Level Security (bắt buộc cho Supabase)
ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;

-- 2. Cấp quyền cho các role của Supabase
GRANT ALL ON TABLE triggers TO authenticated;
GRANT ALL ON TABLE triggers TO service_role;
GRANT SELECT ON TABLE triggers TO anon;

-- 3. Cấp quyền USAGE cho sequence (nếu có)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 4. Cấp quyền EXECUTE cho các function liên quan
GRANT EXECUTE ON FUNCTION create_trigger(UUID, post_type_enum, UUID, UUID, UUID, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION confirm_trigger(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_trigger(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION auto_expire_triggers() TO authenticated;
GRANT EXECUTE ON FUNCTION auto_expire_triggers() TO service_role;

-- 5. RLS Policies — cho phép user đã đăng nhập truy cập triggers
-- Policy: User có thể SELECT triggers mà họ là creator hoặc target
CREATE POLICY "Users can view their own triggers"
    ON triggers FOR SELECT
    TO authenticated
    USING (
        auth.uid() = created_by
        OR auth.uid() = target_user_id
        OR auth.uid() = finder_user_id
    );

-- Policy: User có thể INSERT trigger (function sẽ validate logic)
CREATE POLICY "Users can create triggers"
    ON triggers FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- Policy: User có thể UPDATE trigger mà họ liên quan
CREATE POLICY "Users can update their triggers"
    ON triggers FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = created_by
        OR auth.uid() = target_user_id
    );

-- Policy: Service role có full access (cho cron jobs, backend)
CREATE POLICY "Service role has full access"
    ON triggers FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
