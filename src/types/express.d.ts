// 扩展Express Request接口以包含user属性
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: 'admin' | 'merchant' | 'customer';
        email?: string;
        username?: string;
      };
    }
  }
}

// 确保文件被当作模块处理
export {};
