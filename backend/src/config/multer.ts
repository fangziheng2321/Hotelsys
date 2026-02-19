import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/AppError';

// 配置存储引擎
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 确保该目录在项目根目录下已创建
    cb(null, 'uploads/hotels/');
  },
  filename: (req, file, cb) => {
    // 使用 UUID 重命名文件，防止重名和中文名乱码 
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

// 文件过滤器：只允许上传图片
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('请上传图片格式文件（jpg, png, webp 等）', 400), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 限制 5MB 
  }
});