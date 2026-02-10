// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

import sequelize from './config/database';
import logger from './config/logger';
import { AppError } from './utils/AppError';
import swaggerRouter from './routes/swagger.routes';
import healthRouter from './routes/health.routes';
import authRouter from './routes/auth.routes';
import hotelRouter from './routes/hotel.routes';

// 加载环境变量
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api';

// 安全中间件
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true
  })
);

// 请求限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: '请求过于频繁，请稍后再试'
});
app.use(limiter);

// 解析请求体
app.use(express.json({ limit: process.env.MAX_FILE_SIZE || '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 压缩响应
app.use(compression());

// 请求日志中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// 1. 静态资源托管,否则前端无法加载图片 
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API路由
app.use(`${API_PREFIX}/health`, healthRouter);
app.use(`${API_PREFIX}`, authRouter);
app.use(`${API_PREFIX}/hotels`, hotelRouter);
app.use('/api-docs', swaggerRouter);

// 404处理
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`找不到 ${req.originalUrl}`, 404));
});

// 全局错误处理中间件
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.message, { stack: error.stack });

  if (error instanceof AppError) {
    // 路径 1: 返回了 response
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.statusCode
      }
    });
  }

  // 未知错误 - 路径 2: 也要加上 return 确保 TypeScript 满意
  return res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : '服务器内部错误',
      code: 500
    }
  });
});

// 启动服务器
/*if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`服务器启动成功，端口：${PORT}`);
    logger.info(`API文档：http://localhost:${PORT}/api-docs`);
    logger.info(`健康检查：http://localhost:${PORT}/api/health`);
  });
}
*/

export default app;

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('数据库连接成功');
    
    // 如果你希望代码自动同步表结构（开发环境建议开启）
    // await sequelize.sync({ alter: true }); 

    app.listen(PORT, () => {
      logger.info(`服务运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('无法连接到数据库:', error);
    process.exit(1);
  }
}

startServer();