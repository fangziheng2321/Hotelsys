-- 创建数据库
CREATE DATABASE IF NOT EXISTS hotel_booking DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hotel_booking;


-- 1. 用户表
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
  password_hash VARCHAR(255) NOT NULL COMMENT '加密密码',
  role ENUM('merchant', 'admin', 'customer') NOT NULL DEFAULT 'customer' COMMENT '角色：商户/管理员/客户',
  phone VARCHAR(20) COMMENT '手机号',
  avatar_url VARCHAR(500) COMMENT '头像URL',
  is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
  last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  INDEX idx_role_is_active (role, is_active),
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';


-- 2. 酒店表
CREATE TABLE hotels (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '酒店ID',
  merchant_id INT UNSIGNED NOT NULL COMMENT '所属商户ID',
  name_zh VARCHAR(100) NOT NULL COMMENT '酒店中文名',
  name_en VARCHAR(100) COMMENT '酒店英文名',
  hotel_type ENUM('domestic', 'overseas', 'homestay', 'hourly') DEFAULT 'domestic' COMMENT '酒店类型',
  address VARCHAR(255) NOT NULL COMMENT '详细地址',
  city VARCHAR(50) NOT NULL COMMENT '城市',
  star_rating TINYINT UNSIGNED NOT NULL DEFAULT 3 COMMENT '星级(1-5)',
  rating_score DECIMAL(2,1) DEFAULT 4.0 COMMENT '评分',
  opening_date DATE COMMENT '开业时间',
  status ENUM('pending', 'approved', 'rejected', 'offline') DEFAULT 'pending' COMMENT '状态',
  rejection_reason TEXT COMMENT '驳回原因',
  contact_phone VARCHAR(20) COMMENT '联系电话',
  facilities JSON COMMENT '酒店设施服务(JSON存储,如["免费WiFi", "停车场"])',
  description TEXT COMMENT '酒店详情描述',
  min_price DECIMAL(10, 2) DEFAULT 0.00 COMMENT '起步价(冗余字段提高查询性能)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
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
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='酒店图片表';

-- 4. 房型表
CREATE TABLE rooms (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '房型ID',
  hotel_id INT UNSIGNED NOT NULL COMMENT '所属酒店ID',
  name VARCHAR(50) NOT NULL COMMENT '房型名称(如:豪华大床房)',
  bed_type VARCHAR(50) COMMENT '床型规格(如:1.8米大床)',
  room_size VARCHAR(20) COMMENT '房间面积(如:35㎡)',
  capacity VARCHAR(20) COMMENT '入住人数(如:2人)',
  floor VARCHAR(20) COMMENT '所在楼层(如:5-10层)',
  image_url VARCHAR(500) COMMENT '房型图片',
  total_stock INT UNSIGNED DEFAULT 10 COMMENT '总库存',
  current_price DECIMAL(10, 2) NOT NULL COMMENT '当前价格(元/晚)',
  is_active BOOLEAN DEFAULT TRUE COMMENT '是否售卖',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房型表';


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


-- 6. 房型价格日历表
CREATE TABLE room_prices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '价格ID',
  room_id INT UNSIGNED NOT NULL COMMENT '房型ID',
  date DATE NOT NULL COMMENT '日期',
  -- 价格信息
  base_price DECIMAL(10, 2) NOT NULL COMMENT '基础价格',
  discount_type ENUM('none', 'percentage', 'fixed') DEFAULT 'none' COMMENT '折扣类型',
  discount_value DECIMAL(10, 2) DEFAULT 0 COMMENT '折扣值',
  final_price DECIMAL(10, 2) GENERATED ALWAYS AS (
    CASE discount_type
      WHEN 'percentage' THEN base_price * (1 - discount_value/100)
      WHEN 'fixed' THEN base_price - discount_value
      ELSE base_price
    END
  ) STORED COMMENT '最终价格（计算列）',
  -- 库存限制
  daily_inventory SMALLINT UNSIGNED COMMENT '当日独立库存（为空则使用房型总库存）',
  available_count SMALLINT UNSIGNED COMMENT '当日可预订数量',
  -- 状态
  is_available BOOLEAN DEFAULT TRUE COMMENT '当日是否可预订',
  restriction_note VARCHAR(200) COMMENT '限制说明：如最少连住2晚',
  -- 创建时间
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 外键约束
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  -- 索引（查询最频繁的字段）
  UNIQUE INDEX idx_room_date (room_id, date),
  INDEX idx_date_price (date, final_price),
  INDEX idx_room_available (room_id, is_available, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房型价格日历表';

-- 7. 订单表
CREATE TABLE bookings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
  booking_no VARCHAR(20) UNIQUE NOT NULL COMMENT '订单号：HD202402010001',
  customer_id INT UNSIGNED COMMENT '客户ID（登录用户）',
  hotel_id INT UNSIGNED NOT NULL COMMENT '酒店ID',
  room_id INT UNSIGNED NOT NULL COMMENT '房型ID',
  -- 预订日期信息
  check_in_date DATE NOT NULL COMMENT '入住日期',
  check_out_date DATE NOT NULL COMMENT '离店日期',
  night_count TINYINT UNSIGNED GENERATED ALWAYS AS (DATEDIFF(check_out_date, check_in_date)) STORED COMMENT '入住晚数',
  -- 房客信息
  guest_name VARCHAR(100) NOT NULL COMMENT '入住人姓名',
  guest_phone VARCHAR(20) NOT NULL COMMENT '入住人手机',
  guest_email VARCHAR(100) COMMENT '入住人邮箱',
  special_requests TEXT COMMENT '特殊要求',
  -- 价格信息
  room_price_per_night DECIMAL(10, 2) NOT NULL COMMENT '每晚单价（下单时价格）',
  total_amount DECIMAL(10, 2) NOT NULL COMMENT '订单总金额',
  discount_amount DECIMAL(10, 2) DEFAULT 0 COMMENT '折扣金额',
  final_amount DECIMAL(10, 2) NOT NULL COMMENT '实际支付金额',
  -- 订单状态
  status ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show') 
    DEFAULT 'pending' COMMENT '订单状态',
  cancellation_reason TEXT COMMENT '取消原因',
  -- 支付信息
  payment_status ENUM('unpaid', 'paid', 'refunded', 'partially_refunded') DEFAULT 'unpaid' COMMENT '支付状态',
  payment_method VARCHAR(50) COMMENT '支付方式',
  paid_at TIMESTAMP NULL COMMENT '支付时间',
  -- 时间戳
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  cancelled_at TIMESTAMP NULL COMMENT '取消时间',
  -- 外键
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  -- 索引
  INDEX idx_booking_no (booking_no),
  INDEX idx_customer_id (customer_id),
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_status_created (status, created_at),
  INDEX idx_check_in_date (check_in_date),
  INDEX idx_check_out_date (check_out_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';


