declare global {
  namespace Express {
    interface AuthUser {
      id: number;
      role: 'admin' | 'merchant' | 'customer';
      username: string;
      email: string;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}
export {};