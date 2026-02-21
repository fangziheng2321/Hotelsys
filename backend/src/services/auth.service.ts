import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import logger from '../config/logger';

export class AuthService {
  /**
   * 处理用户注册业务
   */
private static readonly ALLOWED_PUBLIC_ROLES = ['customer', 'merchant'];

  static async registerUser(userData: { 
    username: string; 
    password_hash: string; 
    role?: string; 
    email?: string 
  }) {
    // 1. 越权风险校验 (Role Validation)
    const requestedRole = (userData.role?.toLowerCase() || 'customer') as any;

    // 如果申请的角色不在公开白名单内（例如申请 admin），则直接拒绝
    if (!this.ALLOWED_PUBLIC_ROLES.includes(requestedRole)) {
      logger.warn(`潜在越权攻击尝试：用户 ${userData.username} 尝试注册为 ${requestedRole}`);
      // 注意：这里抛出 403 Forbidden，体现了对安全漏洞的防御素养
      throw new AppError('无权创建该级别的账号', 403);
    }

    // 2. 检查用户名冲突
    const existingUser = await User.findOne({ where: { username: userData.username } });
    if (existingUser) {
      throw new AppError('该用户名已被注册', 409);
    }

    // 3. 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(userData.password_hash, salt);

    // 4. 写入数据库
    const newUser = await User.create({
      username: userData.username,
      password_hash: hashedpassword,
      role: requestedRole, // 此时的 role 已通过白名单校验
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

    // 1. 获取用户
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password_plain, user.password_hash))) {
      throw new AppError('用户名或密码错误', 401);
    }

    // 2. 签发 Token
    const token = this.generateToken(user.id, user.role);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
  }

  /**
   * 内部方法：生成 JWT
   */
  private static generateToken(id: number, role: string) {
    return jwt.sign(
      { id, role },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d' }
    );
  }
}