import { Injectable, Logger, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { getSupabaseClient } from '../../config/supabase.config';

@Injectable()
export class UploadService implements OnModuleInit {
  private readonly logger = new Logger(UploadService.name);
  private readonly BUCKET_NAME = 'post_images';

  private get supabase() {
    return getSupabaseClient();
  }

  /**
   * Tự động tạo bucket `post_images` (public) khi module khởi động.
   * Nếu bucket đã tồn tại → skip.
   */
  async onModuleInit() {
    try {
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === this.BUCKET_NAME);

      if (!exists) {
        const { error } = await this.supabase.storage.createBucket(this.BUCKET_NAME, {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024, // 5 MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        });
        if (error) {
          this.logger.warn(`Không tạo được bucket "${this.BUCKET_NAME}": ${error.message}`);
        } else {
          this.logger.log(`✅ Đã tạo bucket "${this.BUCKET_NAME}" (public)`);
        }
      } else {
        this.logger.log(`Bucket "${this.BUCKET_NAME}" đã tồn tại — skip`);
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
}
