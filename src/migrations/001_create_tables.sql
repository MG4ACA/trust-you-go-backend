-- Trust You Go Database - Complete Schema
-- MySQL 8.0+
-- Created: January 3, 2026

-- ============================================
-- 1. ADMINS TABLE
-- ============================================
CREATE TABLE admins (
    admin_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_admins_email (email),
    INDEX idx_admins_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. TRAVELERS TABLE
-- ============================================
CREATE TABLE travelers (
    traveler_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_travelers_email (email),
    INDEX idx_travelers_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. AGENTS TABLE
-- ============================================
CREATE TABLE agents (
    agent_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_agents_email (email),
    INDEX idx_agents_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. LOCATIONS TABLE
-- ============================================
CREATE TABLE locations (
    location_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location_type ENUM('tourist_spot', 'accommodation', 'restaurant', 'activity') NOT NULL,
    location_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_locations_type (location_type),
    INDEX idx_locations_is_active (is_active),
    INDEX idx_locations_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. LOCATION_IMAGES TABLE
-- ============================================
CREATE TABLE location_images (
    image_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    location_id CHAR(36) NOT NULL,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    display_order INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE,
    INDEX idx_location_images_location (location_id),
    INDEX idx_location_images_order (location_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. PACKAGES TABLE
-- ============================================
CREATE TABLE packages (
    package_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    no_of_days INT NOT NULL,
    is_template BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published') DEFAULT 'draft',
    is_active BOOLEAN DEFAULT TRUE,
    base_price DECIMAL(10,2),
    created_by CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(admin_id) ON DELETE SET NULL,
    INDEX idx_packages_is_template (is_template),
    INDEX idx_packages_status (status),
    INDEX idx_packages_is_active (is_active),
    INDEX idx_packages_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. PACKAGE_LOCATIONS TABLE
-- ============================================
CREATE TABLE package_locations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    package_id CHAR(36) NOT NULL,
    location_id CHAR(36) NOT NULL,
    day_number INT NOT NULL,
    visit_order INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE RESTRICT,
    INDEX idx_package_locations_package (package_id),
    INDEX idx_package_locations_location (location_id),
    INDEX idx_package_locations_day (package_id, day_number, visit_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    booking_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    package_id CHAR(36) NOT NULL,
    traveler_id CHAR(36) NOT NULL,
    agent_id CHAR(36),
    status ENUM('temporary', 'confirmed', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'temporary',
    no_of_travelers INT NOT NULL DEFAULT 1,
    start_date DATE,
    end_date DATE,
    total_amount DECIMAL(10,2),
    payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmation_date TIMESTAMP NULL,
    confirmed_by CHAR(36),
    admin_notes TEXT,
    traveler_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE RESTRICT,
    FOREIGN KEY (traveler_id) REFERENCES travelers(traveler_id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE SET NULL,
    FOREIGN KEY (confirmed_by) REFERENCES admins(admin_id) ON DELETE SET NULL,
    INDEX idx_bookings_status (status),
    INDEX idx_bookings_traveler (traveler_id),
    INDEX idx_bookings_agent (agent_id),
    INDEX idx_bookings_package (package_id),
    INDEX idx_bookings_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. PACKAGE_REQUESTS TABLE
-- ============================================
CREATE TABLE package_requests (
    request_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    traveler_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    no_of_days INT NOT NULL,
    no_of_travelers INT NOT NULL DEFAULT 1,
    preferred_start_date DATE,
    budget_range VARCHAR(100),
    special_requirements TEXT,
    status ENUM('pending', 'reviewing', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by CHAR(36),
    created_package_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (traveler_id) REFERENCES travelers(traveler_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES admins(admin_id) ON DELETE SET NULL,
    FOREIGN KEY (created_package_id) REFERENCES packages(package_id) ON DELETE SET NULL,
    INDEX idx_package_requests_traveler (traveler_id),
    INDEX idx_package_requests_status (status),
    INDEX idx_package_requests_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
