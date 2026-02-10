import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

// 注意：这里不需要加 /api 前缀，因为在 app.ts 中统一挂载时已经处理了
router.post('/PCregister', authController.register); // 
router.post('/PClogin', authController.login);       // 

export default router;