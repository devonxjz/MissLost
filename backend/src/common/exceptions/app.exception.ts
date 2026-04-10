import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public readonly errorCode?: string,
  ) {
    super({ message, statusCode, error: errorCode }, statusCode);
  }
}

export class NotFoundException extends AppException {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} với id "${id}" không tồn tại` : `${resource} không tồn tại`,
      HttpStatus.NOT_FOUND,
      'NOT_FOUND',
    );
  }
}

export class UnauthorizedException extends AppException {
  constructor(message = 'Bạn cần đăng nhập để thực hiện thao tác này') {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

export class ForbiddenException extends AppException {
  constructor(message = 'Bạn không có quyền thực hiện thao tác này') {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT, 'CONFLICT');
  }
}

export class ValidationException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR');
  }
}
