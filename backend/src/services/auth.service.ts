import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import logger from '../config/logger';
import redis from '../config/redis';

export class AuthService {
  /**
   * 处理用户注册业务
   */
private static readonly ALLOWED_PUBLIC_ROLES = ['admin', 'merchant'];

  private static readonly CACHE_KEYS = {
    // 缓存用户信息
    USER_PROFILE: (id: number | string) => `auth:user:${id}`,
    // Token 黑名单,退出登录
    BLACKLIST: (token: string) => `auth:blacklist:${token}`
  };

  private static readonly CACHE_TTL = 7200;

  static async registerUser(userData: { 
    username: string; 
    password_hash: string; 
    role?: string; 
    email?: string 
  }) {
    // 角色校验
    const requestedRole = userData.role?.toLowerCase();

    if (!requestedRole || !this.ALLOWED_PUBLIC_ROLES.includes(requestedRole)) {
      logger.warn(`非法注册尝试：用户 ${userData.username} 尝试注册为 ${requestedRole || '未指定角色'}`);
      throw new AppError('请选择合法的注册角色（商户或管理员）', 403); //
    }

    // 检查用户名冲突
    const existingUser = await User.findOne({ where: { username: userData.username } });
    if (existingUser) {
      throw new AppError('该用户名已被注册', 409); 
    }

    // 密码加密与写入
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(userData.password_hash, salt);

    const newUser = await User.create({
      username: userData.username,
      password_hash: hashedpassword,
      role: requestedRole as 'admin' | 'merchant', 
      email: userData.email || `${userData.username}@example.com`,
      is_active: true
    });

    return newUser;
  }

  /**
   * 处理用户登录业务
   */
  static async loginUser(username: string, password_plain: string) {
    
    console.log('--- 调试登录输入 ---');
    console.log('Username:', username);
    console.log('password_plain:', password_plain);

    // 获取用户
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password_plain, user.password_hash))) {
      throw new AppError('用户名或密码错误', 401);
    }

    // 发 Token
    const token = this.generateToken(user.id, user.role);

    //缓存用户信息
    const userProfile = {
      id: user.id,
      username: user.username,
      role: user.role,
      is_active: user.is_active
    };
    await redis.setex(this.CACHE_KEYS.USER_PROFILE(user.id), this.CACHE_TTL, JSON.stringify(userProfile));

    return {
      token,
      user: userProfile
    };
  }


  /**
   * 退出登录
   */
  static async logout(token: string, userId: number) {
    // 将 Token 加入黑名单
    const expireIn = 7 * 24 * 3600; 
    await redis.setex(this.CACHE_KEYS.BLACKLIST(token), expireIn, '1');

    // 清理用户缓存
    await redis.del(this.CACHE_KEYS.USER_PROFILE(userId));
    
    return true;
  }

  /**
   * 获取当前在线用户
   */
  static async getAuthenticatedUser(id: number) {
    const cacheKey = this.CACHE_KEYS.USER_PROFILE(id);
    
    // 读缓存
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 缓存失效查库
    const user = await User.findByPk(id, { attributes: ['id', 'username', 'role', 'is_active'] });
    if (user) {
      await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(user));
    }
    return user;
  }

  /**
   * 生成 JWT
   */
  private static generateToken(id: number, role: string) {
    return jwt.sign(
      { id, role },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d' }
    );
  }
}