// src/routes/health.routes.ts
import { Router, Request, Response } from 'express';
import sequelize from '../config/database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // 检查数据库连接
    await sequelize.authenticate();
    
    const healthcheck = {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      status: 'UP',
      checks: {
        database: 'healthy'
      }
    };
    
    res.status(200).json(healthcheck);
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;