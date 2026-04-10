## Phân tích UI hiện tại

Từ file `code.html`, dự án đang dùng:
- **Tailwind CSS** với Material Design color system (primary `#3647dc`, surface, on-surface...)
- **Plus Jakarta Sans** font
- **Material Symbols Outlined** icons
- **Glass morphism** (`backdrop-blur`, `bg-white/80`) là ngôn ngữ thiết kế chủ đạo
- Trang hiện có: Chat, Feed, Lost, Found, Storage, Trust Score trong sidebar nav

---

## Plan tổng thể — Màn hình cần xây dựng thêm

---

## Màn hình cần xây mới (chưa có)

**Auth group — dùng chung design language của project (glass morphism + Tailwind config hiện có):**

1. **Login** — email/password, link đến register, forgot password
2. **Register** — full name, student ID (mã số SV UEH), email, password, confirm password. Role mặc định là `user`, admin chỉ được tạo thủ công

**Admin group — sidebar nav khác với user (ẩn các tab Chat/Trust Score, thêm các tab quản lý):**

3. **Admin — Duyệt bài** (`/admin/review`) — danh sách bài pending, preview nội dung + ảnh + YOLO label, nút Approve / Reject kèm lý do
4. **Admin — Dashboard** (`/admin/dashboard`) — thống kê số bài pending/approved/rejected, số user, số trao trả thành công
5. **Admin — Quản lý user** (`/admin/users`) — list user, xem profile, khóa tài khoản

---

## Điều chỉnh màn hình hiện có

| Màn hình | Cần thêm |
|---|---|
| Feed | Chỉ hiện bài đã `approved`. Badge "Chờ duyệt" trên bài của chính mình |
| Lost / Found post form | Thêm trạng thái `pending` sau khi submit — hiện thông báo "Bài của bạn đang chờ admin duyệt" |
| Sidebar nav (User) | Thêm tab **"Bài của tôi"** để user sửa/xóa bài do mình tạo |
| Profile | Hiển thị `training_points`, lịch sử trao trả |

---

## Logic phân quyền theo schema DB đã thiết kế

Kết hợp với bảng `USERS` đã có trường `role`:

- **User** — `CRUD` trên `LOST_POSTS` / `FOUND_POSTS` do chính mình tạo (`WHERE user_id = me`). Không thể approve bài.
- **Admin** — đọc tất cả bài bất kể status, có thể `UPDATE status = 'approved'/'rejected'` và `DELETE` bất kỳ bài nào.
- **Bài đăng** — thêm trường `status: 'pending' | 'approved' | 'rejected'` vào `LOST_POSTS` và `FOUND_POSTS` (trong schema trước tôi đã có `status: open|matched|closed` — cần mở rộng thành `pending | open | matched | closed | rejected`).

---

Bạn muốn tôi bắt tay vào code màn hình nào trước? Đề xuất của tôi là **Login + Register** vì đây là điểm vào của toàn bộ luồng, sau đó đến **Admin Review** vì đó là chức năng mới hoàn toàn chưa có UI.

Phase 1 — Auth & Users: Bảng users với enum role (user/admin/storage_staff), auth_tokens cho verify email / reset password, refresh_tokens cho JWT.
Phase 2 — Item Categories & YOLO: Bảng item_categories đã seed sẵn 11 loại đồ vật với mapping YOLO COCO label → tiếng Việt. Bảng yolo_detection_logs ghi lại mọi lần AI detect để cải thiện model sau.
Phase 3 — Posts: Hai bảng lost_posts / found_posts với trường status mở rộng thành 5 trạng thái (pending → approved/rejected → matched → closed), trường reviewed_by + rejection_reason cho admin, full-text search index với pg_trgm. Kèm audit log post_status_history.
Phase 4 — AI Matching: Bảng ai_matches lưu điểm similarity tổng hợp từ YOLO score + text score, có slot embedding_score để bật pgvector về sau.
Phase 5 — Storage Kho UEH: Bảng storage_locations seed sẵn 2 cơ sở, storage_items với mã vật lý UEH-2025-XXXX, foreign key circular với found_posts dùng DEFERRABLE để tránh deadlock.
Phase 6 — Chat: conversations ràng buộc unique theo cặp (lost_post_id, found_post_id, user_a, user_b), trigger tự cập nhật last_message_at.
Phase 7 — Handover & Điểm: handovers với verification_code 6 số tự sinh, function grant_training_points() chạy tự động khi status = completed, bảng training_point_logs ghi lịch sử đầy đủ.
Phase 8 — Notifications: Enum notification_type bao phủ mọi sự kiện


-- ============================================================
--  LOST & FOUND UEH — DATABASE SCHEMA
--  PostgreSQL 15+
--  Tổ chức theo Phase triển khai
-- ============================================================

-- Extensions cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- Full-text search mô tả
-- CREATE EXTENSION IF NOT EXISTS "vector";     -- Bật khi cần AI embedding (Phase 3)


-- ============================================================
--  PHASE 1 — AUTH & USER MANAGEMENT
--  Mục tiêu: Đăng ký, đăng nhập, phân quyền User / Admin
-- ============================================================

CREATE TYPE user_role AS ENUM ('user', 'admin', 'storage_staff');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'pending_verify');

CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name           VARCHAR(150)    NOT NULL,
    email               VARCHAR(255)    NOT NULL UNIQUE,
    password_hash       TEXT            NOT NULL,
    student_id          VARCHAR(20)     UNIQUE,                      -- Mã số SV UEH (nullable cho staff ngoài trường)
    phone               VARCHAR(20),
    avatar_url          TEXT,
    role                user_role       NOT NULL DEFAULT 'user',
    status              account_status  NOT NULL DEFAULT 'pending_verify',
    training_points     INT             NOT NULL DEFAULT 0,
    email_verified_at   TIMESTAMPTZ,
    last_login_at       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Index tìm kiếm nhanh theo email và student_id
CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_users_student_id   ON users(student_id);
CREATE INDEX idx_users_role         ON users(role);

-- Bảng token reset password / verify email
CREATE TABLE auth_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       TEXT            NOT NULL UNIQUE,
    type        VARCHAR(30)     NOT NULL,   -- 'email_verify' | 'password_reset'
    expires_at  TIMESTAMPTZ     NOT NULL,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auth_tokens_token   ON auth_tokens(token);
CREATE INDEX idx_auth_tokens_user_id ON auth_tokens(user_id);

-- Refresh token cho JWT
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT        NOT NULL UNIQUE,
    device_info TEXT,
    ip_address  INET,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);


-- ============================================================
--  PHASE 2 — ITEM CATEGORIES & AI DETECTION
--  Mục tiêu: Quản lý loại đồ vật, tích hợp YOLO detection
-- ============================================================

CREATE TABLE item_categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)    NOT NULL UNIQUE,    -- Tên hiển thị: "Ba lô", "Ví", "Điện thoại"
    yolo_label      VARCHAR(100),                       -- YOLO class name: "backpack", "wallet", "cell phone"
    yolo_label_vi   VARCHAR(100),                       -- Nhãn tiếng Việt gợi ý
    icon_name       VARCHAR(80),                        -- Material Symbols icon name
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    sort_order      INT             NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Seed data: map YOLO COCO labels → category
INSERT INTO item_categories (name, yolo_label, yolo_label_vi, icon_name, sort_order) VALUES
    ('Ba lô / Túi xách',    'backpack',     'Ba lô',        'backpack',         1),
    ('Ví tiền',             'wallet',       'Ví',           'wallet',           2),
    ('Điện thoại',          'cell phone',   'Điện thoại',   'smartphone',       3),
    ('Laptop / Máy tính',   'laptop',       'Laptop',       'laptop',           4),
    ('Chìa khóa',           'key',          'Chìa khóa',    'key',              5),
    ('Sách / Vở',           'book',         'Sách',         'menu_book',        6),
    ('Tai nghe',            'headphones',   'Tai nghe',     'headphones',       7),
    ('Kính mắt',            'glasses',      'Kính',         'eyeglasses',       8),
    ('Ô / Dù',              'umbrella',     'Ô',            'umbrella',         9),
    ('Thẻ / Giấy tờ',       NULL,           'Thẻ/Giấy tờ', 'badge',            10),
    ('Khác',                NULL,           'Khác',         'help',             99);

-- Lịch sử detection của YOLO (để cải thiện model sau này)
CREATE TABLE yolo_detection_logs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url           TEXT        NOT NULL,
    raw_detections      JSONB       NOT NULL,   -- [{label, confidence, bbox}, ...]
    top_label           VARCHAR(100),
    top_confidence      NUMERIC(5,4),
    matched_category_id UUID        REFERENCES item_categories(id),
    user_confirmed      BOOLEAN,               -- User có chấp nhận gợi ý không
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
--  PHASE 3 — POSTS (LOST & FOUND)
--  Mục tiêu: Đăng bài mất đồ / nhặt được đồ, luồng duyệt admin
-- ============================================================

CREATE TYPE post_status AS ENUM (
    'pending',      -- Chờ admin duyệt
    'approved',     -- Đã duyệt, hiển thị public
    'rejected',     -- Bị từ chối
    'matched',      -- Đã tìm được chủ / tìm được đồ
    'closed'        -- Đóng bài (hết hạn hoặc user tự đóng)
);

-- Bảng bài đăng MẤT ĐỒ
CREATE TABLE lost_posts (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                 UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id             UUID            REFERENCES item_categories(id),

    -- Nội dung bài đăng
    title                   VARCHAR(255)    NOT NULL,
    description             TEXT            NOT NULL,
    location_lost           VARCHAR(255)    NOT NULL,   -- Địa điểm mất
    time_lost               TIMESTAMPTZ     NOT NULL,   -- Thời gian mất
    contact_info            VARCHAR(255),               -- Thông tin liên hệ thêm

    -- Hình ảnh
    image_urls              TEXT[]          DEFAULT '{}',

    -- YOLO detection
    yolo_detected_label     VARCHAR(100),
    yolo_confidence         NUMERIC(5,4),
    yolo_detection_id       UUID            REFERENCES yolo_detection_logs(id),

    -- Trạng thái & duyệt bài
    status                  post_status     NOT NULL DEFAULT 'pending',
    rejection_reason        TEXT,
    reviewed_by             UUID            REFERENCES users(id),
    reviewed_at             TIMESTAMPTZ,

    -- Metadata
    view_count              INT             NOT NULL DEFAULT 0,
    is_urgent               BOOLEAN         NOT NULL DEFAULT FALSE,
    reward_note             VARCHAR(255),               -- Ghi chú thưởng (nếu có)
    expires_at              TIMESTAMPTZ,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lost_posts_user_id     ON lost_posts(user_id);
CREATE INDEX idx_lost_posts_status      ON lost_posts(status);
CREATE INDEX idx_lost_posts_category    ON lost_posts(category_id);
CREATE INDEX idx_lost_posts_created_at  ON lost_posts(created_at DESC);
-- Full-text search tiếng Việt
CREATE INDEX idx_lost_posts_fts         ON lost_posts USING GIN (to_tsvector('simple', title || ' ' || description));

-- Bảng bài đăng NHẶT ĐƯỢC ĐỒ
CREATE TABLE found_posts (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                 UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id             UUID            REFERENCES item_categories(id),

    -- Nội dung bài đăng
    title                   VARCHAR(255)    NOT NULL,
    description             TEXT            NOT NULL,
    location_found          VARCHAR(255)    NOT NULL,   -- Địa điểm nhặt được
    time_found              TIMESTAMPTZ     NOT NULL,   -- Thời gian nhặt được
    contact_info            VARCHAR(255),

    -- Hình ảnh
    image_urls              TEXT[]          DEFAULT '{}',

    -- YOLO detection
    yolo_detected_label     VARCHAR(100),
    yolo_confidence         NUMERIC(5,4),
    yolo_detection_id       UUID            REFERENCES yolo_detection_logs(id),

    -- Kho UEH
    is_in_storage           BOOLEAN         NOT NULL DEFAULT FALSE,
    storage_item_id         UUID,                       -- FK thêm sau khi tạo bảng storage_items

    -- Trạng thái & duyệt bài
    status                  post_status     NOT NULL DEFAULT 'pending',
    rejection_reason        TEXT,
    reviewed_by             UUID            REFERENCES users(id),
    reviewed_at             TIMESTAMPTZ,

    -- Metadata
    view_count              INT             NOT NULL DEFAULT 0,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_found_posts_user_id    ON found_posts(user_id);
CREATE INDEX idx_found_posts_status     ON found_posts(status);
CREATE INDEX idx_found_posts_category   ON found_posts(category_id);
CREATE INDEX idx_found_posts_created_at ON found_posts(created_at DESC);
CREATE INDEX idx_found_posts_fts        ON found_posts USING GIN (to_tsvector('simple', title || ' ' || description));

-- Trigger tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lost_posts_updated_at
    BEFORE UPDATE ON lost_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_found_posts_updated_at
    BEFORE UPDATE ON found_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Lịch sử thay đổi status bài đăng (audit log)
CREATE TABLE post_status_history (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_type   VARCHAR(10)     NOT NULL,   -- 'lost' | 'found'
    post_id     UUID            NOT NULL,
    old_status  post_status,
    new_status  post_status     NOT NULL,
    changed_by  UUID            NOT NULL REFERENCES users(id),
    note        TEXT,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_post_status_history_post ON post_status_history(post_type, post_id);


-- ============================================================
--  PHASE 4 — AI MATCHING
--  Mục tiêu: Tự động ghép cặp lost ↔ found theo YOLO + mô tả
-- ============================================================

CREATE TYPE match_method AS ENUM ('yolo_label', 'text_similarity', 'manual', 'combined');
CREATE TYPE match_status AS ENUM ('pending', 'confirmed', 'rejected');

CREATE TABLE ai_matches (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lost_post_id        UUID            NOT NULL REFERENCES lost_posts(id) ON DELETE CASCADE,
    found_post_id       UUID            NOT NULL REFERENCES found_posts(id) ON DELETE CASCADE,

    -- Điểm matching
    similarity_score    NUMERIC(5,4)    NOT NULL,       -- 0.0 → 1.0
    yolo_score          NUMERIC(5,4),                   -- Điểm riêng từ YOLO label match
    text_score          NUMERIC(5,4),                   -- Điểm riêng từ text similarity
    -- embedding_score  NUMERIC(5,4),                   -- Bật Phase 5 khi có pgvector

    match_method        match_method    NOT NULL,
    status              match_status    NOT NULL DEFAULT 'pending',

    -- Xác nhận từ 2 phía
    confirmed_by_owner  BOOLEAN         DEFAULT NULL,   -- Chủ đồ xác nhận
    confirmed_by_finder BOOLEAN         DEFAULT NULL,   -- Người nhặt xác nhận

    auto_notified       BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    UNIQUE (lost_post_id, found_post_id)
);

CREATE INDEX idx_ai_matches_lost    ON ai_matches(lost_post_id);
CREATE INDEX idx_ai_matches_found   ON ai_matches(found_post_id);
CREATE INDEX idx_ai_matches_score   ON ai_matches(similarity_score DESC);
CREATE INDEX idx_ai_matches_status  ON ai_matches(status);


-- ============================================================
--  PHASE 5 — STORAGE (KHO UEH)
--  Mục tiêu: Quản lý đồ vật đã được nhập kho tại UEH
-- ============================================================

CREATE TABLE storage_locations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150)    NOT NULL,   -- "Phòng 101 – Tòa B2"
    address         TEXT            NOT NULL,
    building        VARCHAR(100),
    floor           VARCHAR(20),
    campus          VARCHAR(100),               -- "Cơ sở A", "Cơ sở B"
    contact_phone   VARCHAR(20),
    contact_name    VARCHAR(100),
    open_hours      VARCHAR(255),               -- "Thứ 2 – 6: 8:00–17:00"
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TYPE storage_item_status AS ENUM ('stored', 'claimed', 'discarded', 'transferred');

CREATE TABLE storage_items (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    found_post_id       UUID            NOT NULL REFERENCES found_posts(id),
    storage_location_id UUID            NOT NULL REFERENCES storage_locations(id),

    item_code           VARCHAR(50)     NOT NULL UNIQUE,    -- Mã định danh vật lý tại kho, e.g. "UEH-2025-0042"
    status              storage_item_status NOT NULL DEFAULT 'stored',

    -- Người nộp vào kho
    submitted_by        UUID            REFERENCES users(id),   -- User hoặc staff
    received_by         UUID            REFERENCES users(id),   -- Storage staff xác nhận nhận

    -- Người nhận lại
    claimed_by          UUID            REFERENCES users(id),
    claimed_at          TIMESTAMPTZ,
    claim_notes         TEXT,

    -- Timeline
    stored_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    discard_after       TIMESTAMPTZ,    -- Ngày dự kiến thanh lý nếu không có ai nhận
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_storage_items_found_post   ON storage_items(found_post_id);
CREATE INDEX idx_storage_items_location     ON storage_items(storage_location_id);
CREATE INDEX idx_storage_items_status       ON storage_items(status);
CREATE INDEX idx_storage_items_item_code    ON storage_items(item_code);

-- Thêm FK ngược lại cho found_posts.storage_item_id
ALTER TABLE found_posts
    ADD CONSTRAINT fk_found_posts_storage_item
    FOREIGN KEY (storage_item_id)
    REFERENCES storage_items(id)
    DEFERRABLE INITIALLY DEFERRED;

-- Seed: địa điểm kho mẫu
INSERT INTO storage_locations (name, address, building, floor, campus, contact_phone, open_hours) VALUES
    ('Phòng Bảo vệ – Cơ sở A', '59C Nguyễn Đình Chiểu, Q.3', 'Cổng chính', 'Tầng trệt', 'Cơ sở A', '028.3820.9733', 'T2–T7: 6:00–22:00'),
    ('Văn phòng Công tác SV – B2', '279 Nguyễn Tri Phương, Q.10', 'Tòa B', 'Tầng 2', 'Cơ sở B', '028.3820.9700', 'T2–T6: 8:00–17:00');


-- ============================================================
--  PHASE 6 — CHAT
--  Mục tiêu: Hệ thống nhắn tin giữa chủ đồ và người nhặt
-- ============================================================

CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lost_post_id    UUID        REFERENCES lost_posts(id) ON DELETE SET NULL,
    found_post_id   UUID        REFERENCES found_posts(id) ON DELETE SET NULL,
    user_a_id       UUID        NOT NULL REFERENCES users(id),  -- Người khởi tạo
    user_b_id       UUID        NOT NULL REFERENCES users(id),  -- Người nhận
    ai_match_id     UUID        REFERENCES ai_matches(id),      -- Nếu được tạo từ AI match
    last_message_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Không cho phép tạo 2 cuộc hội thoại cùng cặp user cho cùng cặp bài đăng
    UNIQUE (lost_post_id, found_post_id, user_a_id, user_b_id),
    CHECK (user_a_id <> user_b_id)
);

CREATE INDEX idx_conversations_user_a   ON conversations(user_a_id);
CREATE INDEX idx_conversations_user_b   ON conversations(user_b_id);
CREATE INDEX idx_conversations_last_msg ON conversations(last_message_at DESC NULLS LAST);

CREATE TABLE messages (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id     UUID        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id           UUID        NOT NULL REFERENCES users(id),

    content             TEXT,
    image_url           TEXT,
    -- Loại tin nhắn đặc biệt
    message_type        VARCHAR(30) NOT NULL DEFAULT 'text',    -- 'text' | 'image' | 'system' | 'handover_request'

    is_read             BOOLEAN     NOT NULL DEFAULT FALSE,
    read_at             TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ,    -- Soft delete
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CHECK (content IS NOT NULL OR image_url IS NOT NULL)
);

CREATE INDEX idx_messages_conversation  ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_sender        ON messages(sender_id);
CREATE INDEX idx_messages_unread        ON messages(conversation_id) WHERE is_read = FALSE;

-- Trigger cập nhật last_message_at khi có tin nhắn mới
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_conversation_last_msg
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();


-- ============================================================
--  PHASE 7 — HANDOVER & ĐIỂM RÈN LUYỆN
--  Mục tiêu: Xác nhận trao trả, cộng điểm tự động
-- ============================================================

CREATE TYPE handover_status AS ENUM ('pending', 'owner_confirmed', 'finder_confirmed', 'completed', 'disputed');

CREATE TABLE handovers (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lost_post_id            UUID            NOT NULL REFERENCES lost_posts(id),
    found_post_id           UUID            NOT NULL REFERENCES found_posts(id),
    conversation_id         UUID            REFERENCES conversations(id),
    storage_item_id         UUID            REFERENCES storage_items(id),

    -- Xác nhận 2 phía
    status                  handover_status NOT NULL DEFAULT 'pending',
    confirmed_by_owner_id   UUID            REFERENCES users(id),
    confirmed_by_finder_id  UUID            REFERENCES users(id),
    owner_confirmed_at      TIMESTAMPTZ,
    finder_confirmed_at     TIMESTAMPTZ,

    -- Mã xác thực (6 chữ số, chia sẻ offline để confirm)
    verification_code       VARCHAR(10)     NOT NULL DEFAULT LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'),
    code_expires_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW() + INTERVAL '48 hours',

    -- Điểm rèn luyện
    points_awarded          INT             NOT NULL DEFAULT 10,
    points_granted_at       TIMESTAMPTZ,

    -- Ghi chú
    handover_location       VARCHAR(255),
    handover_note           TEXT,
    completed_at            TIMESTAMPTZ,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_handovers_lost_post    ON handovers(lost_post_id);
CREATE INDEX idx_handovers_found_post   ON handovers(found_post_id);
CREATE INDEX idx_handovers_status       ON handovers(status);

-- Lịch sử điểm rèn luyện
CREATE TABLE training_point_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    handover_id     UUID        REFERENCES handovers(id),
    points_delta    INT         NOT NULL,           -- Dương = cộng, âm = trừ
    reason          VARCHAR(255) NOT NULL,
    balance_after   INT         NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_training_point_logs_user ON training_point_logs(user_id);

-- Function cộng điểm tự động khi handover completed
CREATE OR REPLACE FUNCTION grant_training_points(p_handover_id UUID)
RETURNS VOID AS $$
DECLARE
    v_handover      handovers%ROWTYPE;
    v_finder_id     UUID;
    v_points        INT;
    v_balance       INT;
BEGIN
    SELECT * INTO v_handover FROM handovers WHERE id = p_handover_id;
    IF v_handover.status <> 'completed' THEN RETURN; END IF;
    IF v_handover.points_granted_at IS NOT NULL THEN RETURN; END IF;

    -- Lấy user_id của người nhặt từ found_posts
    SELECT user_id INTO v_finder_id FROM found_posts WHERE id = v_handover.found_post_id;
    v_points := v_handover.points_awarded;

    -- Cập nhật điểm
    UPDATE users SET training_points = training_points + v_points
    WHERE id = v_finder_id
    RETURNING training_points INTO v_balance;

    -- Ghi log
    INSERT INTO training_point_logs (user_id, handover_id, points_delta, reason, balance_after)
    VALUES (v_finder_id, p_handover_id, v_points, 'Trao trả đồ thành công', v_balance);

    -- Đánh dấu đã cấp điểm
    UPDATE handovers SET points_granted_at = NOW() WHERE id = p_handover_id;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
--  PHASE 8 — NOTIFICATIONS
--  Mục tiêu: Thông báo real-time cho mọi sự kiện quan trọng
-- ============================================================

CREATE TYPE notification_type AS ENUM (
    'post_approved',
    'post_rejected',
    'match_found',
    'new_message',
    'handover_request',
    'handover_completed',
    'storage_available',
    'points_awarded',
    'system'
);

CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        notification_type   NOT NULL,
    title       VARCHAR(255)        NOT NULL,
    body        TEXT,

    -- Tham chiếu đến đối tượng liên quan (polymorphic)
    ref_type    VARCHAR(50),        -- 'lost_post' | 'found_post' | 'handover' | 'conversation'
    ref_id      UUID,

    -- Trạng thái
    is_read     BOOLEAN             NOT NULL DEFAULT FALSE,
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id      ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread       ON notifications(user_id) WHERE is_read = FALSE;


-- ============================================================
--  VIEWS — Hỗ trợ API queries phổ biến
-- ============================================================

-- Feed công khai: chỉ bài đã approved, kèm thông tin tác giả và category
CREATE VIEW public_lost_posts AS
SELECT
    lp.*,
    u.full_name         AS author_name,
    u.avatar_url        AS author_avatar,
    ic.name             AS category_name,
    ic.icon_name        AS category_icon
FROM lost_posts lp
JOIN users u            ON lp.user_id    = u.id
LEFT JOIN item_categories ic ON lp.category_id = ic.id
WHERE lp.status = 'approved';

CREATE VIEW public_found_posts AS
SELECT
    fp.*,
    u.full_name         AS author_name,
    u.avatar_url        AS author_avatar,
    ic.name             AS category_name,
    ic.icon_name        AS category_icon
FROM found_posts fp
JOIN users u            ON fp.user_id    = u.id
LEFT JOIN item_categories ic ON fp.category_id = ic.id
WHERE fp.status = 'approved';

-- Admin view: tất cả bài pending
CREATE VIEW admin_pending_posts AS
SELECT 'lost' AS post_type, id, user_id, title, description, status, created_at FROM lost_posts  WHERE status = 'pending'
UNION ALL
SELECT 'found',             id, user_id, title, description, status, created_at FROM found_posts WHERE status = 'pending'
ORDER BY created_at ASC;

-- Dashboard thống kê nhanh
CREATE VIEW admin_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM users WHERE role = 'user')                        AS total_users,
    (SELECT COUNT(*) FROM lost_posts  WHERE status = 'approved')            AS active_lost_posts,
    (SELECT COUNT(*) FROM found_posts WHERE status = 'approved')            AS active_found_posts,
    (SELECT COUNT(*) FROM lost_posts  WHERE status = 'pending')
    + (SELECT COUNT(*) FROM found_posts WHERE status = 'pending')           AS pending_review,
    (SELECT COUNT(*) FROM handovers   WHERE status = 'completed')           AS total_handovers,
    (SELECT COUNT(*) FROM storage_items WHERE status = 'stored')            AS items_in_storage;


-- ============================================================
--  ROW LEVEL SECURITY (RLS) — Phân quyền tầng DB
-- ============================================================

ALTER TABLE lost_posts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE found_posts ENABLE ROW LEVEL SECURITY;

-- User chỉ xem bài approved HOẶC bài của chính mình
CREATE POLICY lost_posts_user_select ON lost_posts
    FOR SELECT USING (status = 'approved' OR user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY found_posts_user_select ON found_posts
    FOR SELECT USING (status = 'approved' OR user_id = current_setting('app.current_user_id')::UUID);

-- User chỉ sửa/xóa bài của chính mình (và chỉ khi pending hoặc approved)
CREATE POLICY lost_posts_user_modify ON lost_posts
    FOR ALL USING (
        user_id = current_setting('app.current_user_id')::UUID
        AND status IN ('pending', 'approved')
    );

CREATE POLICY found_posts_user_modify ON found_posts
    FOR ALL USING (
        user_id = current_setting('app.current_user_id')::UUID
        AND status IN ('pending', 'approved')
    );

-- ============================================================
--  SAMPLE DATA — Dữ liệu mẫu để test
-- ============================================================

-- Admin mặc định
INSERT INTO users (full_name, email, password_hash, role, status, email_verified_at)
VALUES (
    'Admin UEH',
    'admin@ueh.edu.vn',
    '$2b$12$placeholder_hash_thay_bang_bcrypt_thuc',   -- Thay bằng hash thực
    'admin',
    'active',
    NOW()
);

-- Storage staff
INSERT INTO users (full_name, email, password_hash, role, status, email_verified_at)
VALUES (
    'Nhân viên Bảo vệ A',
    'baove.csA@ueh.edu.vn',
    '$2b$12$placeholder_hash_thay_bang_bcrypt_thuc',
    'storage_staff',
    'active',
    NOW()
);