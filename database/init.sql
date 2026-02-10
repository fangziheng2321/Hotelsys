-- 创建数据库
CREATE DATABASE IF NOT EXISTS hotel_bookingusers DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hotel_booking;

-- 1. 用户表
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','merchant', 'customer') NOT NULL DEFAULT 'customer',
  email VARCHAR(100),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_role_is_active (role, is_active),
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 酒店表
CREATE TABLE hotels (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  merchant_id INT UNSIGNED NOT NULL,
  name_zh VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  address VARCHAR(255) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  star_rating TINYINT UNSIGNED NOT NULL,
  opening_date DATE NOT NULL,
  status ENUM('draft', 'pending', 'approved', 'rejected', 'offline') DEFAULT 'draft',
  rejection_reason TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  facilities JSON,
  nearby_attractions JSON,
  transportation_info JSON,
  description TEXT,
  total_rooms SMALLINT UNSIGNED DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL,
  FOREIGN KEY (merchant_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_merchant (merchant_id),
  INDEX idx_city (city),
  INDEX idx_star_rating (star_rating),
  INDEX idx_status_approved_at (status, approved_at),
  INDEX idx_location (latitude, longitude),
  INDEX idx_opening_date (opening_date),
  FULLTEXT INDEX idx_search (name_zh, name_en, address, city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 酒店图片表
CREATE TABLE hotel_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_type ENUM('exterior', 'lobby', 'room', 'facility', 'other') DEFAULT 'other',
  caption VARCHAR(200),
  sort_order TINYINT UNSIGNED DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_by INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_sort_order (sort_order),
  INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 房型表
CREATE TABLE rooms (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT UNSIGNED NOT NULL,
  room_type VARCHAR(50) NOT NULL,
  room_code VARCHAR(20),
  description TEXT,
  max_guests TINYINT UNSIGNED DEFAULT 2,
  bed_type VARCHAR(20),
  bed_count TINYINT UNSIGNED DEFAULT 1,
  room_size VARCHAR(20),
  amenities JSON,
  total_inventory SMALLINT UNSIGNED NOT NULL,
  available_inventory SMALLINT UNSIGNED NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_room_type (room_type),
  INDEX idx_is_active (is_active),
  UNIQUE INDEX idx_hotel_room_code (hotel_id, room_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 房型价格日历表
CREATE TABLE room_prices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  discount_type ENUM('none', 'percentage', 'fixed') DEFAULT 'none',
  discount_value DECIMAL(10, 2) DEFAULT 0,
  final_price DECIMAL(10, 2) GENERATED ALWAYS AS (
    CASE discount_type
      WHEN 'percentage' THEN base_price * (1 - discount_value/100)
      WHEN 'fixed' THEN base_price - discount_value
      ELSE base_price
    END
  ) STORED,
  daily_inventory SMALLINT UNSIGNED,
  available_count SMALLINT UNSIGNED,
  is_available BOOLEAN DEFAULT TRUE,
  restriction_note VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_room_date (room_id, date),
  INDEX idx_date_price (date, final_price),
  INDEX idx_room_available (room_id, is_available, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 订单表
CREATE TABLE bookings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_no VARCHAR(20) UNIQUE NOT NULL,
  customer_id INT UNSIGNED,
  hotel_id INT UNSIGNED NOT NULL,
  room_id INT UNSIGNED NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  night_count TINYINT UNSIGNED GENERATED ALWAYS AS (DATEDIFF(check_out_date, check_in_date)) STORED,
  guest_name VARCHAR(100) NOT NULL,
  guest_phone VARCHAR(20) NOT NULL,
  guest_email VARCHAR(100),
  special_requests TEXT,
  room_price_per_night DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  final_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show') DEFAULT 'pending',
  cancellation_reason TEXT,
  payment_status ENUM('unpaid', 'paid', 'refunded', 'partially_refunded') DEFAULT 'unpaid',
  payment_method VARCHAR(50),
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP NULL,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  INDEX idx_booking_no (booking_no),
  INDEX idx_customer_id (customer_id),
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_status_created (status, created_at),
  INDEX idx_check_in_date (check_in_date),
  INDEX idx_check_out_date (check_out_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. 审核记录表
CREATE TABLE audit_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT UNSIGNED NOT NULL,
  admin_id INT UNSIGNED NOT NULL,
  old_status VARCHAR(20) NOT NULL,
  new_status VARCHAR(20) NOT NULL,
  reason TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;