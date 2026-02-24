import { Request, Response, NextFunction } from 'express';

/**
 * 处理图片上传后的返回
 */
export const uploadImages = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const files = req.files as Express.Multer.File[];
    
    // 1. 校验文件是否存在
    if (!files || files.length === 0) {
      res.status(400).json({ 
        success: false, 
        message: '请选择要上传的图片' 
      });
      return; 
    }

    // 2. 构造可供前端访问的 URL 数组 
    const urls = files.map(file => {
      // 路径对应 app.ts 中配置的静态资源托管路径
      return `/public/uploads/hotels/${file.filename}`;
    });

    // 3. 成功响应
    res.status(200).json({
      success: true,
      data: { urls },
      message: '图片上传成功'
    });
    
    // 显式结束函数
    return;
  } catch (error) {

    next(error);
  }
};