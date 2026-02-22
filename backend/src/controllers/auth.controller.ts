import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import logger from '../config/logger';

/**
 * 管理系统登录/注册
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password, Role, Email } = req.body;

    // 存在性校验
    if (!username || !password || !Role) {
      res.status(400).json({ 
        success: false, 
        message: '用户名、密码和注册角色不能为空' 
      });
      return;
    }

    // 调用 Service
    await AuthService.registerUser({
      username: username,
      password_hash: password,
      role: Role,
      email: Email
    });

    logger.info(`新用户注册成功 [Role: ${Role}]: ${username}`); //

    res.status(201).json({
      success: true,
      message: '注册成功'
    });
  } catch (error) {
    next(error); //
  }
};

/**
 * 用户登录
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;

    // 1. 调用 Service 执行登录逻辑
    const result = await AuthService.loginUser(username, password);

    logger.info(`用户登录成功: ${username}`);

    // 2. 返回结果
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};