// src/utils/AppError.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 常见错误类型
export class NotFoundError extends AppError {
  constructor(message = '资源未找到') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = '未授权访问') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = '禁止访问') {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = '参数验证失败') {
    super(message, 400);
  }
}