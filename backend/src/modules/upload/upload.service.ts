import { Injectable, Logger, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { getSupabaseClient } from '../../config/supabase.config';

@Injectable()
export class UploadService implements OnModuleInit {
  private readonly logger = new Logger(UploadService.name);
  private readonly BUCKET_NAME = 'post_images';
  private readonly AVATAR_BUCKET = 'avatars';

  private get supabase() {
    return getSupabaseClient();
  }

  /**
   * Tự động tạo bucket `post_images` (public) khi module khởi động.
   * Nếu bucket đã tồn tại → skip.
   */
  async onModuleInit() {
    await this.ensureBucket(this.BUCKET_NAME);
    await this.ensureBucket(this.AVATAR_BUCKET);
  }

  private async ensureBucket(bucketName: string) {
    try {
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === bucketName);

      if (!exists) {
        const { error } = await this.supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024, // 5 MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        });
        if (error) {
          this.logger.warn(`Không tạo được bucket "${bucketName}": ${error.message}`);
        } else {
          this.logger.log(`✅ Đã tạo bucket "${bucketName}" (public)`);
        }
      } else {
        this.logger.log(`Bucket "${bucketName}" đã tồn tại — skip`);
      }
    } catch (err) {
      this.logger.warn(`Kiểm tra bucket thất bại: ${err}`);
    }
  }

  /**
   * Upload một file ảnh lên Supabase Storage → trả về Public URL.
   *
   * Path structure: `{userId}/{timestamp}-{randomHex}.{ext}`
   */
  async uploadPostImage(file: Express.Multer.File, userId: string): Promise<string> {
    // Xác định extension từ mimetype
    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    const ext = extMap[file.mimetype] ?? 'jpg';
    const uniqueName = `${Date.now()}-${randomBytes(6).toString('hex')}`;
    const filePath = `${userId}/${uniqueName}.${ext}`;

    const { error } = await this.supabase.storage
      .from(this.BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      this.logger.error(`Upload thất bại: ${error.message}`);
      throw new InternalServerErrorException(`Upload ảnh thất bại: ${error.message}`);
    }

    // Lấy public URL
    const { data } = this.supabase.storage.from(this.BUCKET_NAME).getPublicUrl(filePath);
    this.logger.log(`Uploaded → ${data.publicUrl}`);

    return data.publicUrl;
  }

  /**
   * Upload avatar lên Supabase Storage bucket 'avatars' → trả về Public URL.
   *
   * Flow an toàn:
   *   1. Lấy avatar_url cũ từ DB (lưu biến tạm)
   *   2. Upload ảnh MỚI lên Storage (filename unique, không đụng hàng)
   *   3. Cập nhật avatar_url mới vào DB
   *      - Nếu DB fail → xóa file vừa upload (tránh orphaned file)
   *   4. Xóa file avatar CŨ trên Storage (nếu có)
   *      - Nếu xóa fail → chỉ log warn, không ảnh hưởng user
   */
  async uploadAvatar(file: Express.Multer.File, userId: string): Promise<string> {
    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    const ext = extMap[file.mimetype] ?? 'jpg';

    // ── Step 1: Lấy avatar_url cũ từ DB (lưu biến tạm để xóa sau) ──
    let oldStoragePath: string | null = null;
    try {
      const { data: currentUser } = await this.supabase
        .from('users')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (currentUser?.avatar_url) {
        const url = new URL(currentUser.avatar_url);
        const pathParts = url.pathname.split('/avatars/');
        if (pathParts[1]) {
          oldStoragePath = decodeURIComponent(pathParts[1]);
        }
      }
    } catch (e) {
      this.logger.warn(`Không đọc được avatar cũ của user ${userId}: ${e}`);
    }

    // ── Step 2: Upload ảnh MỚI với filename unique ──
    const uniqueName = `${Date.now()}-${randomBytes(6).toString('hex')}`;
    const newFilePath = `${userId}/${uniqueName}.${ext}`;

    const { error: uploadError } = await this.supabase.storage
      .from(this.AVATAR_BUCKET)
      .upload(newFilePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false, // Không ghi đè — filename unique nên không bao giờ trùng
      });

    if (uploadError) {
      this.logger.error(`Avatar upload thất bại: ${uploadError.message}`);
      throw new InternalServerErrorException(`Upload avatar thất bại: ${uploadError.message}`);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.AVATAR_BUCKET)
      .getPublicUrl(newFilePath);
    const newPublicUrl = publicUrlData.publicUrl;

    // ── Step 3: Cập nhật avatar_url mới vào DB ──
    const { error: dbError } = await this.supabase
      .from('users')
      .update({ avatar_url: newPublicUrl })
      .eq('id', userId);

    if (dbError) {
      // DB fail → dọn file vừa upload để tránh orphaned file
      this.logger.error(`DB update avatar_url thất bại: ${dbError.message}`);
      await this.supabase.storage.from(this.AVATAR_BUCKET).remove([newFilePath]);
      this.logger.warn(`Đã rollback file mới: ${newFilePath}`);
      throw new InternalServerErrorException(`Cập nhật avatar thất bại: ${dbError.message}`);
    }

    // ── Step 4: Xóa file avatar CŨ trên Storage (chỉ sau khi DB đã OK) ──
    if (oldStoragePath && oldStoragePath !== newFilePath) {
      try {
        await this.supabase.storage.from(this.AVATAR_BUCKET).remove([oldStoragePath]);
        this.logger.log(`Đã xóa avatar cũ: ${oldStoragePath}`);
      } catch (e) {
        // Không throw — user đã có avatar mới, file cũ thành rác nhưng vô hại
        this.logger.warn(`Không xóa được avatar cũ (${oldStoragePath}): ${e}`);
      }
    }

    this.logger.log(`✅ Avatar uploaded cho user ${userId} → ${newPublicUrl}`);
    return newPublicUrl;
  }
}
