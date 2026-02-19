import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import User from '../models/User';
import logger from '../config/logger';

// 定义用户类型
interface AuthUser {
  id: number;
  role: 'admin' | 'merchant' | 'customer';
}

// 扩展Request接口以包含user属性
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// 1. 保护路由中间件：确保用户已登录
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 获取 Token (通常在 Header 的 Authorization: Bearer <token>)
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('请先登录以访问此资源', 401));
    }

    // 校验 Token [cite: 114]
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: string };

    // 检查用户是否仍然存在（防止账号被删但 Token 仍有效）
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser || !currentUser.is_active) {
      return next(new AppError('该账号已失效或不存在', 401));
    }

    // 将用户信息挂载到 req 对象上，供后续 Controller 使用
    (req as any).user = {
      id: currentUser.id,
      role: currentUser.role
    };

    next();
  } catch (error) {
    logger.error('JWT 校验失败', error);
    next(new AppError('无效的或过期的 Token', 401));
  }
};

// 2. 角色限制中间件：基于角色的访问控制 (RBAC)
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 此时 req.user 已经被 protect 中间件注入
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return next(new AppError('您没有权限执行此操作', 403));
    }
    next();
  };
};
