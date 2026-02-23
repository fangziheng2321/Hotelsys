import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import redis from '../config/redis';
import { AppError } from '../utils/AppError';
import logger from '../config/logger';

export const idempotency = (ttl: number = 120) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 针对 POST 请求进行幂等校验
    if (req.method !== 'POST') return next();

    const requestId = req.headers['x-request-id'] || 'no-id';
    const userId = req.user?.id;

    //生成请求负载的指纹,选取酒店名和地址,即使 Request-ID 冲突，只要酒店内容不同，就不会被拦截
    const { name, address, region } = req.body;
    const businessKey = `${name}-${address}-${region}`;
    const fingerprint = crypto
      .createHash('md5')
      .update(JSON.stringify(businessKey))
      .digest('hex');

    // 构造Redis Key    idempotency:{userId}:{requestId}:{fingerprint}
    const redisKey = `idempotency:merchant:${userId}:${requestId}:${fingerprint}`;

    try {
      /**
       * 使用 Redis 原子操作 SET key value NX EX
       */
      const result = await redis.set(redisKey, 'processing','EX', ttl, 'NX' );

      if (!result) {
        logger.warn(`拦截到重复提交请求: User ${userId}, RequestID ${requestId}`);
        // 如果键已存在，说明是2分钟内的重复请求，直接拦截
        return next(new AppError('请勿重复提交，请求正在处理中或已完成', 409)); // 409 Conflict
      }

      // 校验通过
      next();
    } catch (error) {
      logger.error('幂等性校验 Redis 出错', error);
      next(error);
    }
  };
};