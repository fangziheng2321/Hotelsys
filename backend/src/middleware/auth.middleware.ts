import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import User from '../models/User';
import logger from '../config/logger';
import redis from '../config/redis';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      role: 'admin' | 'merchant' | 'customer';
      username: string;
      email: string;
    };
  }
}

// 确保用户已登录
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 获取 Token
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('请先登录以访问此资源', 401));
    }

    // 检查 Token 是否在黑名单中
    const isBlacklisted = await redis.get(`auth:blacklist:${token}`);
    if (isBlacklisted) {
      logger.warn(`拦截到已注销的 Token 尝试访问: ${token}`);
      return next(new AppError('该登录已失效，请重新登录', 401));
    }

    // 校验 Token 签名
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: string };

    // 检查用户是否仍然存在
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser || !currentUser.is_active) {
      return next(new AppError('该账号已失效或不存在', 401));
    }

    // 将用户信息挂载到 req 对象上
    req.user = {
      id: currentUser.id,
      role: currentUser.role as 'admin' | 'merchant' | 'customer',
      username: currentUser.username,
      email: currentUser.email
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        return next(new AppError('您的登录已过期，请重新登录', 401));
    }
    logger.error('JWT 校验失败', error);
    next(new AppError('无效的或过期的 Token', 401));
  }
};

// 角色限制中间件
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user || !roles.includes(user.role)) {
      return next(new AppError('您没有权限执行此操作', 403));
    }
    next();
  };
};
