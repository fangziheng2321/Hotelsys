-- 创建数据库
CREATE DATABASE IF NOT EXISTS hotel_booking DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hotel_booking;


-- 1. 用户表
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
  password_hash VARCHAR(255) NOT NULL COMMENT '加密密码',
  role ENUM('merchant', 'admin', 'customer') NOT NULL DEFAULT 'customer' COMMENT '角色：商户/管理员/客户',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
  phone VARCHAR(20) COMMENT '手机号',
  avatar_url VARCHAR(500) COMMENT '头像URL',
  is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
  last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_role_is_active (role, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';


-- 2. 酒店表
CREATE TABLE hotels (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '酒店ID',
  merchant_id INT UNSIGNED NOT NULL COMMENT '所属商户ID',
  name_zh VARCHAR(100) NOT NULL COMMENT '酒店中文名',
  address VARCHAR(255) NOT NULL COMMENT '详细地址',
  city VARCHAR(50) NOT NULL COMMENT '城市',
  star_rating TINYINT UNSIGNED NOT NULL DEFAULT 3 COMMENT '星级(1-5)',
  status ENUM('pending', 'approved', 'rejected', 'offline') DEFAULT 'pending' COMMENT '状态',
  rejection_reason TEXT COMMENT '驳回原因',
  contact_phone VARCHAR(20) COMMENT '联系电话',
  facilities JSON COMMENT '酒店设施服务(JSON存储,如["免费WiFi", "停车场"])',
  description TEXT COMMENT '酒店详情描述',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  district VARCHAR(50),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_featured BOOLEAN DEFAULT FALSE,
  hotel_type ENUM('domestic', 'overseas', 'homestay', 'hourly') DEFAULT 'domestic' COMMENT '酒店类型',
  FOREIGN KEY (merchant_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_city_status (city, status),
  INDEX idx_hotel_type (hotel_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='酒店表';


-- 3. 酒店图片表
CREATE TABLE hotel_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL COMMENT '图片URL',
  is_primary BOOLEAN DEFAULT FALSE COMMENT '是否为主图/封面图',
  sort_order TINYINT UNSIGNED DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image_type ENUM('exterior', 'lobby', 'room', 'facility', 'other') DEFAULT 'other',
  caption VARCHAR(200),
  uploaded_by INT UNSIGNED,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='酒店图片表';

-- 4. 房型表
CREATE TABLE rooms (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '房型ID',
  hotel_id INT UNSIGNED NOT NULL COMMENT '所属酒店ID',
  name VARCHAR(50) NOT NULL COMMENT '房型名称',
  bed_count TINYINT UNSIGNED DEFAULT 1 COMMENT '床的数量',
  bed_size DECIMAL(3, 2) DEFAULT 1.80 COMMENT '床的尺寸(米)',
  room_size VARCHAR(20) COMMENT '房间面积',
  capacity VARCHAR(20) COMMENT '入住人数',
  floor VARCHAR(20) COMMENT '所在楼层',
  image_url VARCHAR(500) COMMENT '房型图片',
  total_stock INT UNSIGNED DEFAULT 10 COMMENT '总库存',
  current_price DECIMAL(10, 2) NOT NULL COMMENT '当前价格',
  is_active BOOLEAN DEFAULT TRUE COMMENT '是否售卖',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 5. 审核记录表
CREATE TABLE audit_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT UNSIGNED NOT NULL,
  admin_id INT UNSIGNED NOT NULL,
  action ENUM('approve', 'reject', 'offline', 'online') NOT NULL COMMENT '操作动作',
  reason TEXT COMMENT '审核意见',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审核记录表';

