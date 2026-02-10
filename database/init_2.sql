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
  merchant_id INT UNSIGNED NOT NULL COMMENT '商户ID',
  -- 必须维度（来自需求文档）
  name_zh VARCHAR(100) NOT NULL COMMENT '酒店中文名',
  name_en VARCHAR(100) COMMENT '酒店英文名',
  address VARCHAR(255) NOT NULL COMMENT '详细地址',
  city VARCHAR(50) NOT NULL COMMENT '城市',
  district VARCHAR(50) COMMENT '区/县',
  latitude DECIMAL(10, 8) COMMENT '纬度',
  longitude DECIMAL(11, 8) COMMENT '经度',
  star_rating TINYINT UNSIGNED NOT NULL COMMENT '星级(1-5)',
  opening_date DATE NOT NULL COMMENT '开业时间',
  -- 业务字段
  status ENUM('draft', 'pending', 'approved', 'rejected', 'offline') 
    DEFAULT 'draft' COMMENT '状态：草稿/待审核/已通过/已拒绝/已下线',
  rejection_reason TEXT COMMENT '拒绝原因',
  is_featured BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
  contact_phone VARCHAR(20) COMMENT '联系电话',
  contact_email VARCHAR(100) COMMENT '联系邮箱',
  -- 可选维度
  facilities JSON COMMENT '设施：{"wifi": true, "parking": true, "pool": false, ...}',
  nearby_attractions JSON COMMENT '附近景点：["景点1", "景点2"]',
  transportation_info JSON COMMENT '交通信息：{"地铁": ["2号线", "10号线"], "公交": ["123路"]}',
  description TEXT COMMENT '酒店描述',
  -- 统计字段（避免频繁COUNT查询）
  total_rooms SMALLINT UNSIGNED DEFAULT 0 COMMENT '总房型数',
  average_rating DECIMAL(3,2) DEFAULT 0.00 COMMENT '平均评分',
  review_count INT UNSIGNED DEFAULT 0 COMMENT '评价数量',
  -- 时间戳
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  approved_at TIMESTAMP NULL COMMENT '审核通过时间',
  -- 外键约束
  FOREIGN KEY (merchant_id) REFERENCES users(id) ON DELETE CASCADE,
  -- 索引设计
  INDEX idx_merchant (merchant_id),
  INDEX idx_city (city),
  INDEX idx_star_rating (star_rating),
  INDEX idx_status_approved_at (status, approved_at),
  INDEX idx_location (latitude, longitude),
  INDEX idx_opening_date (opening_date),
  FULLTEXT INDEX idx_search (name_zh, name_en, address, city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='酒店表';


-- 3. 酒店图片表
CREATE TABLE hotel_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '图片ID',
  hotel_id INT UNSIGNED NOT NULL COMMENT '酒店ID',
  image_url VARCHAR(500) NOT NULL COMMENT '图片URL',
  image_type ENUM('exterior', 'lobby', 'room', 'facility', 'other') DEFAULT 'other' COMMENT '图片类型',
  caption VARCHAR(200) COMMENT '图片说明',
  sort_order TINYINT UNSIGNED DEFAULT 0 COMMENT '排序（越小越前）',
  is_primary BOOLEAN DEFAULT FALSE COMMENT '是否为主图',
  uploaded_by INT UNSIGNED COMMENT '上传者用户ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_sort_order (sort_order),
  INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='酒店图片表';


-- 4. 房型表
CREATE TABLE rooms (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '房型ID',
  hotel_id INT UNSIGNED NOT NULL COMMENT '所属酒店ID',
  -- 房型基本信息
  room_type VARCHAR(50) NOT NULL COMMENT '房型名称：豪华大床房/标准双床房等',
  room_code VARCHAR(20) COMMENT '房型代码：内部使用',
  description TEXT COMMENT '房型描述',
  -- 房型属性
  max_guests TINYINT UNSIGNED DEFAULT 2 COMMENT '最大入住人数',
  bed_type VARCHAR(20) COMMENT '床型：大床/双床',
  bed_count TINYINT UNSIGNED DEFAULT 1 COMMENT '床数量',
  room_size VARCHAR(20) COMMENT '房间面积：30㎡',
  -- 设施（JSON存储）
  amenities JSON COMMENT '设施：{"tv": true, "fridge": true, "balcony": false}',
  -- 库存与状态
  total_inventory SMALLINT UNSIGNED NOT NULL COMMENT '总库存量',
  available_inventory SMALLINT UNSIGNED NOT NULL COMMENT '可用库存',
  is_active BOOLEAN DEFAULT TRUE COMMENT '是否可售',
  -- 时间戳
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 外键约束
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  -- 索引
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_room_type (room_type),
  INDEX idx_is_active (is_active),
  UNIQUE INDEX idx_hotel_room_code (hotel_id, room_code) COMMENT '同一酒店内房型代码唯一'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房型表';


-- 5. 房型价格日历表
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

-- 6. 订单表
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


-- 7. 审核记录表
CREATE TABLE audit_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
  hotel_id INT UNSIGNED NOT NULL COMMENT '酒店ID',
  admin_id INT UNSIGNED NOT NULL COMMENT '审核管理员ID',
  old_status VARCHAR(20) NOT NULL COMMENT '原状态',
  new_status VARCHAR(20) NOT NULL COMMENT '新状态',
  reason TEXT COMMENT '审核意见/原因',
  ip_address VARCHAR(45) COMMENT '操作IP',
  user_agent TEXT COMMENT '浏览器标识',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '审核时间',
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='审核记录表';