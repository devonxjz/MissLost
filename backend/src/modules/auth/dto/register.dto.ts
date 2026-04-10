import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  full_name: string;

  @ApiProperty({ example: 'sinhvien@ueh.edu.vn' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  confirm_password: string;

  @ApiPropertyOptional({ example: '31231020001' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8,12}$/, { message: 'Mã số sinh viên phải từ 8-12 chữ số' })
  student_id?: string;
}
