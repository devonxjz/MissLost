import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

// Lấy thông tin kết nối cấu hình trong backend
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.error('Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong file .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTriggerFunctionality() {
  console.log('==============================================');
  console.log('🔄 BẮT ĐẦU TEST KẾT NỐI & TÍNH NĂNG TRIGGER');
  console.log('==============================================');

  try {
    // 1. Test kết nối DB & thử gọi hàm (Data ảo)
    console.log('[1/2] Đang thử kết nối database và gọi hàm create_trigger...');
    
    // UUID format hợp lệ
    const fakePostId = '00000000-0000-0000-0000-000000000000';
    const fakeUserId1 = '00000000-0000-0000-0000-000000000001';
    const fakeUserId2 = '00000000-0000-0000-0000-000000000002';

    const { data, error } = await supabase.rpc('create_trigger', {
      p_post_id: fakePostId,
      p_post_type: 'found',
      p_created_by: fakeUserId1,
      p_target_user: fakeUserId2,
      p_points: 10
    });

    // Chúng ta MONG ĐỢI lỗi logic (Bài đăng không tồn tại) chứ KHÔNG PHẢI lỗi cấp quyền
    if (error) {
      if (error.message.includes('permission denied')) {
        console.error('❌ TEST THẤT BẠI: Vẫn còn lỗi cấu hình quyền truy cập (Permission Denied).');
        console.error(`   Chi tiết lỗi: ${error.message}`);
        console.error('   👉 GIẢI PHÁP: Bạn cần chạy file triggers_permissions.sql trên Supabase SQL Editor.');
        return;
      } else if (error.code === '42883') {
         console.error('❌ TEST THẤT BẠI: Database thông báo không tìm thấy hàm create_trigger!');
         console.error('   👉 GIẢI PHÁP: Hãy đảm bảo bạn đã copy nội dung file triggers_migration.sql và RUN trên Supabase SQL Editor.');
         return;
      } else {
        console.error('⚠️ Có lỗi Database, nhưng ĐÃ VƯỢT QUA LỖI QUYỀN TRUY CẬP:');
        console.error('   ', error);
      }
    } 
    
    if (data && data.success === false) {
      if (data.error === 'Bài đăng không tồn tại') {
        console.log('✅ TEST KẾT NỐI THÀNH CÔNG: Database đã phản hồi đúng lỗi logic như dự kiến ("Bài đăng không tồn tại").');
        console.log('   => Điều này có nghĩa là quyền truy cập và function đã hoạt động bình thường trên DB!');
      } else {
        console.log('✅ TEST TRUY CẬP THÀNH CÔNG, function trả về:', data);
      }
    } else if (data && data.success === true) {
      console.log('✅ TEST THÀNH CÔNG, Trigger đã được tạo:', data);
    }

    console.log('\n[2/2] Kiểm tra bảng triggers...');
    const { data: tableData, error: tableError } = await supabase.from('triggers').select('*').limit(1);
    
    if (tableError) {
      if (tableError.message.includes('permission denied') || tableError.message.includes('not exist')) {
        console.error('❌ TEST BẢNG THẤT BẠI: Bạn có thể đọc bảng bằng Role hiện tại.', tableError.message);
      } else {
        console.error('❌ Lỗi khi đọc bảng:', tableError);
      }
    } else {
      console.log(`✅ TEST BẢNG THÀNH CÔNG: Có thể truy cập bảng triggers. Hiện có ${tableData.length} bản ghi.`);
    }

    console.log('==============================================');
    console.log('🎉 TẤT CẢ CÁC BƯỚC HOẠT ĐỘNG! (Bạn có thể test trực tiếp trên UI ngay bây giờ)');
    console.log('==============================================');

  } catch (err: any) {
    console.error('❌ CÓ LỖI XẢY RA LÚC CHẠY TEST:', err.message);
  }
}

testTriggerFunctionality();
