import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'sinhvien@ueh.edu.vn' })
  @IsEmail()
  email: string;
}
