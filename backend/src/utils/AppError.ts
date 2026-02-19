export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    // 区分 4xx（fail）和 5xx（error）
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    // 修复原型链，确保 instanceof 正常工作
    Object.setPrototypeOf(this, AppError.prototype);

    // 捕捉堆栈信息，方便排查问题
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