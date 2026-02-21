import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import logger from '../config/logger';

/**
 * @description 处理用户注册
 * 管理系统登录/注册
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password, Role, Email } = req.body;

    // 1. 基础存在性校验
    if (!username || !password) {
        res.status(400).json({ 
        success: false, 
        message: '用户名和密码不能为空' 
      });
    }

    // 2. 调用 Service (Service 内部会进行权限校验)
    await AuthService.registerUser({
      username: username,
      password_hash: password,
      role: Role,
      email: Email
    });

    logger.info(`新用户注册成功 [Role: ${Role || 'customer'}]: ${username}`);

    res.status(201).json({
      success: true,
      message: '注册成功'
    });
  } catch (error) {
    // 如果 Service 抛出 403 越权错误，会被这里的 next(error) 捕获
    // 并由 app.ts 中的全局错误处理器返回标准 JSON
    next(error);
  }
};

/**
 * @description 处理用户登录
 * 支持商户和管理员两个角色 
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