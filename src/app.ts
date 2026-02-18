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
import adminRouter from './routes/admin.routes';

import { uploadHotelImages } from './middleware/upload.middleware';
import * as uploadController from './controllers/upload.controller';
import { protect, restrictTo } from './middleware/auth.middleware';

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

// 请求日志记录
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// --- 静态资源与路由配置 ---

// 1. 静态资源托管：让前端能通过 URL 访问上传的酒店图片
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 2. 健康检查路由
app.use(`${API_PREFIX}/health`, healthRouter);

// 3. 认证相关路由 (登录/注册)
app.use(`${API_PREFIX}`, authRouter);

// 4. 图片上传接口
// 必须登录(protect)且角色为商户(restrictTo)，允许并发上传10张名为 'files' 的字段
app.post(
  `${API_PREFIX}/merchant/upload`, 
  protect, 
  restrictTo('merchant'), 
  uploadHotelImages.array('files', 10), 
  uploadController.uploadImages
);

// 5. 酒店业务路由 (创建/更新)
app.use(`${API_PREFIX}/merchant/hotels`, hotelRouter);

// 6. Swagger API 文档
app.use('/api-docs', swaggerRouter);

// 7. 管理员专用路由
app.use(`${API_PREFIX}/admin`, adminRouter);


// --- 错误处理 ---

// 404 处理：找不到定义的路由
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`找不到 ${req.originalUrl}`, 404));
});

// 全局错误处理中间件：统一返回 JSON 格式的报错信息
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.message, { stack: error.stack });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.statusCode
      }
    });
  }

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

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('数据库连接成功');
    
    // 开发环境下自动同步表结构
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true }); 
      logger.info('数据库表结构同步完成');
    }

    app.listen(PORT, () => {
      logger.info(`服务运行在 http://localhost:${PORT}`);
      logger.info(`API预览: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('无法连接到数据库:', error);
    process.exit(1);
  }
}

startServer();

export default app;