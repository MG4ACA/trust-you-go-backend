# Backend Project Structure & Implementation Guide

## Complete Technical Specification

---

## 📋 Table of Contents

1. [Database Schema (MySQL)](#database-schema-mysql)
2. [Code Structure & Organization](#code-structure--organization)
3. [Utility Functions & Helpers](#utility-functions--helpers)
4. [API Response Standards](#api-response-standards)
5. [Error Handling](#error-handling)
6. [Validation Rules](#validation-rules)
7. [Authentication Flow](#authentication-flow)
8. [File Upload System](#file-upload-system)
9. [Email Templates](#email-templates)
10. [Constants & Configurations](#constants--configurations)

---

## 🗄️ Database Schema (MySQL)

### **Database Name:** `trust_you_go`

### **Total Tables:** 9 (8 core + 1 for package requests)

### **Table 1: admins**

```sql
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
```

### **Table 2: travelers**

```sql
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
```

### **Table 3: agents**

```sql
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
```

### **Table 4: locations**

```sql
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
```

### **Table 5: location_images**

```sql
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
```

### **Table 6: packages**

```sql
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
```

### **Table 7: package_locations**

```sql
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
```

### **Table 8: bookings**

```sql
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
```

### **Table 9: package_requests**

Stores custom package requests from travelers (admin manually creates packages from these)

```sql
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
```

**Fields:**

- `request_id` - Primary key (UUID)
- `traveler_id` - Foreign key to travelers table
- `title` - Requested package title
- `description` - Detailed description of what traveler wants
- `no_of_days` - Desired trip duration
- `no_of_travelers` - Number of people
- `preferred_start_date` - When they want to travel
- `budget_range` - Budget expectations (e.g., "$1000-$2000")
- `special_requirements` - Any special needs or requests
- `status` - Request status: 'pending', 'reviewing', 'approved', 'rejected'
- `admin_notes` - Internal admin notes
- `reviewed_by` - Admin who reviewed the request
- `created_package_id` - Link to package created from this request
- `created_at` - Request submission timestamp
- `updated_at` - Last update timestamp

---

## 📁 Code Structure & Organization

### **Models Layer** (`src/models/`)

Each model handles database queries for its entity. No business logic here.

**Example: Admin.js**

```javascript
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class Admin {
  // Find by ID
  static async findById(adminId) {
    const [rows] = await db.query(
      'SELECT admin_id, email, name, contact, is_active, created_at, last_login FROM admins WHERE admin_id = ?',
      [adminId]
    );
    return rows[0];
  }

  // Find by email
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    return rows[0];
  }

  // Create new admin
  static async create(data) {
    const adminId = uuidv4();
    const passwordHash = await bcrypt.hash(data.password, 10);

    await db.query(
      'INSERT INTO admins (admin_id, email, password_hash, name, contact) VALUES (?, ?, ?, ?, ?)',
      [adminId, data.email, passwordHash, data.name, data.contact]
    );

    return this.findById(adminId);
  }

  // List all admins
  static async findAll(filters = {}) {
    let query =
      'SELECT admin_id, email, name, contact, is_active, created_at FROM admins WHERE 1=1';
    const params = [];

    if (filters.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Update admin
  static async update(adminId, data) {
    const updates = [];
    const params = [];

    if (data.name) {
      updates.push('name = ?');
      params.push(data.name);
    }
    if (data.contact) {
      updates.push('contact = ?');
      params.push(data.contact);
    }
    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(data.is_active);
    }

    if (updates.length === 0) return this.findById(adminId);

    params.push(adminId);
    await db.query(`UPDATE admins SET ${updates.join(', ')} WHERE admin_id = ?`, params);

    return this.findById(adminId);
  }

  // Update last login
  static async updateLastLogin(adminId) {
    await db.query('UPDATE admins SET last_login = NOW() WHERE admin_id = ?', [adminId]);
  }

  // Soft delete
  static async deactivate(adminId) {
    await db.query('UPDATE admins SET is_active = FALSE WHERE admin_id = ?', [adminId]);
    return { success: true };
  }
}

module.exports = Admin;
```

---

### **Controllers Layer** (`src/controllers/`)

Handle request/response, call models, apply business logic.

**Example: adminController.js**

```javascript
const Admin = require('../models/Admin');
const { successResponse, errorResponse } = require('../utils/response');

exports.getAllAdmins = async (req, res) => {
  try {
    const { is_active } = req.query;
    const filters = {};

    if (is_active !== undefined) {
      filters.is_active = is_active === 'true';
    }

    const admins = await Admin.findAll(filters);
    return successResponse(res, admins);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return errorResponse(res, 'Admin not found', 'NOT_FOUND', 404);
    }
    return successResponse(res, admin);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    return successResponse(res, admin, 201);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return errorResponse(res, 'Email already exists', 'DUPLICATE_EMAIL', 409);
    }
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.update(req.params.id, req.body);
    return successResponse(res, admin);
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};

exports.deactivateAdmin = async (req, res) => {
  try {
    await Admin.deactivate(req.params.id);
    return successResponse(res, { message: 'Admin deactivated successfully' });
  } catch (error) {
    return errorResponse(res, error.message, 'SERVER_ERROR', 500);
  }
};
```

---

### **Routes Layer** (`src/routes/`)

Define endpoints and apply middleware.

**Example: admin.routes.js**

```javascript
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateJWT, authorizeAdmin } = require('../middleware/auth');
const { validateAdmin } = require('../validators/adminValidator');

// All routes require admin authentication
router.use(authenticateJWT);
router.use(authorizeAdmin);

router.get('/admins', adminController.getAllAdmins);
router.get('/admins/:id', adminController.getAdminById);
router.post('/admins', validateAdmin, adminController.createAdmin);
router.put('/admins/:id', adminController.updateAdmin);
router.delete('/admins/:id', adminController.deactivateAdmin);

module.exports = router;
```

---

## 🛠️ Utility Functions & Helpers

### **Response Formatter** (`src/utils/response.js`)

```javascript
/**
 * Standard success response
 */
exports.successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data: data,
  });
};

/**
 * Standard error response
 */
exports.errorResponse = (res, message, code = 'ERROR', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      code: code,
    },
  });
};

/**
 * Validation error response
 */
exports.validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    error: {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors,
    },
  });
};
```

---

### **Helper Functions** (`src/utils/helpers.js`)

```javascript
const { v4: uuidv4 } = require('uuid');

/**
 * Generate UUID
 */
exports.generateUUID = () => {
  return uuidv4();
};

/**
 * Generate random password
 * Format: Ty2026!xY7p (10 chars, uppercase, lowercase, numbers, special)
 */
exports.generateRandomPassword = () => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const special = '!@#$%&*';

  let password = 'Ty2026!'; // Prefix

  // Add 3 random characters
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));

  return password;
};

/**
 * Format date to YYYY-MM-DD
 */
exports.formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Calculate date difference in days
 */
exports.dateDiffInDays = (date1, date2) => {
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Sanitize filename
 */
exports.sanitizeFilename = (filename) => {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '_')
    .replace(/_+/g, '_');
};

/**
 * Get file extension
 */
exports.getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * Validate email format
 */
exports.isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Mask email for security
 * Example: john.doe@example.com → jo*******@example.com
 */
exports.maskEmail = (email) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  const masked = name.substring(0, 2) + '*'.repeat(name.length - 2);
  return `${masked}@${domain}`;
};
```

---

### **Logger** (`src/utils/logger.js`)

```javascript
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Log info message
 */
exports.info = (message, data = null) => {
  console.log(`${colors.cyan}[INFO]${colors.reset} ${message}`);
  if (data) console.log(data);
};

/**
 * Log success message
 */
exports.success = (message, data = null) => {
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
  if (data) console.log(data);
};

/**
 * Log warning message
 */
exports.warn = (message, data = null) => {
  console.warn(`${colors.yellow}[WARN]${colors.reset} ${message}`);
  if (data) console.warn(data);
};

/**
 * Log error message
 */
exports.error = (message, error = null) => {
  console.error(`${colors.red}[ERROR]${colors.reset} ${message}`);
  if (error) console.error(error);
};

/**
 * Log database query
 */
exports.query = (sql, params = null) => {
  console.log(`${colors.magenta}[QUERY]${colors.reset} ${sql}`);
  if (params) console.log('Params:', params);
};
```

---

### **Constants** (`src/utils/constants.js`)

```javascript
module.exports = {
  // User roles
  ROLES: {
    ADMIN: 'admin',
    TRAVELER: 'traveler',
  },

  // Booking status
  BOOKING_STATUS: {
    TEMPORARY: 'temporary',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },

  // Payment status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PARTIAL: 'partial',
    PAID: 'paid',
    REFUNDED: 'refunded',
  },

  // Package status
  PACKAGE_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
  },

  // Location types
  LOCATION_TYPES: {
    TOURIST_SPOT: 'tourist_spot',
    ACCOMMODATION: 'accommodation',
    RESTAURANT: 'restaurant',
    ACTIVITY: 'activity',
  },

  // File upload
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    THUMBNAIL_SIZE: 300,
  },

  // JWT
  JWT: {
    EXPIRES_IN: '1h',
    ALGORITHM: 'HS256',
  },

  // Email
  EMAIL_TYPES: {
    BOOKING_CONFIRMATION: 'booking_confirmation',
    ACCOUNT_ACTIVATION: 'account_activation',
    PASSWORD_CHANGED: 'password_changed',
  },

  // Error codes
  ERROR_CODES: {
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
    SERVER_ERROR: 'SERVER_ERROR',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    INACTIVE_ACCOUNT: 'INACTIVE_ACCOUNT',
  },
};
```

---

## ✅ Validation Rules

### **Admin Validator** (`src/validators/adminValidator.js`)

```javascript
const { body, validationResult } = require('express-validator');
const { validationErrorResponse } = require('../utils/response');

exports.validateAdmin = [
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),

  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),

  body('contact')
    .trim()
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage('Invalid contact number'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorResponse(res, errors.array());
    }
    next();
  },
];
```

---

## 🔐 Authentication Flow

### **JWT Middleware** (`src/middleware/auth.js`)

```javascript
const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const { ERROR_CODES } = require('../utils/constants');

/**
 * Verify JWT token
 */
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Access token required', ERROR_CODES.UNAUTHORIZED, 401);
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired', ERROR_CODES.TOKEN_EXPIRED, 401);
    }
    return errorResponse(res, 'Invalid token', ERROR_CODES.UNAUTHORIZED, 401);
  }
};

/**
 * Authorize admin role
 */
exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Admin access required', ERROR_CODES.FORBIDDEN, 403);
  }
  next();
};

/**
 * Authorize traveler role
 */
exports.authorizeTraveler = (req, res, next) => {
  if (req.user.role !== 'traveler') {
    return errorResponse(res, 'Traveler access required', ERROR_CODES.FORBIDDEN, 403);
  }
  next();
};

/**
 * Optional authentication (doesn't fail if no token)
 */
exports.optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    // Ignore errors, proceed as unauthenticated
  }

  next();
};
```

---

## 📤 File Upload System

### **Upload Middleware** (`src/middleware/upload.js`)

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { UPLOAD } = require('../utils/constants');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const locationId = req.params.id;
    const uploadPath = path.join('uploads', 'locations', locationId);

    // Create directory if doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
  }
};

// Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE,
  },
});

module.exports = upload;
```

### **File Management** (`src/services/fileService.js`)

```javascript
const path = require('path');
const fs = require('fs').promises;

/**
 * TODO: Generate thumbnail from image (implement when sharp is added)
 * For now, thumbnails will be null
 */
exports.generateThumbnail = async (imagePath) => {
  // Placeholder - will implement with sharp library later
  return null;
};

/**
 * Delete file
 */
exports.deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Ignore if file doesn't exist
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

/**
 * Delete directory
 */
exports.deleteDirectory = async (dirPath) => {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    throw new Error(`Directory deletion failed: ${error.message}`);
  }
};

/**
 * Get file size
 */
exports.getFileSize = async (filePath) => {
  const stats = await fs.stat(filePath);
  return stats.size;
};

/**
 * Convert file path to URL
 */
exports.filePathToUrl = (filePath) => {
  // Convert Windows path to URL path
  return '/' + filePath.replace(/\\/g, '/');
};
```

---

## 📧 Email Templates

### **Email Service** (`src/services/emailService.js`)

```javascript
const nodemailer = require('nodemailer');
const { EMAIL_TYPES } = require('../utils/constants');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send booking confirmation email
 */
exports.sendBookingConfirmation = async (to, data) => {
  const { travelerName, packageTitle, startDate, endDate, bookingId } = data;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Booking Confirmed!</h2>
      <p>Dear ${travelerName},</p>
      <p>Your booking has been confirmed. Here are the details:</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Package:</strong> ${packageTitle}</p>
        <p><strong>Travel Dates:</strong> ${startDate} to ${endDate}</p>
      </div>
      
      <p>Your account has been activated. You can now login to view your booking details.</p>
      
      <p>Best regards,<br>Trust You Go Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Booking Confirmation - Trust You Go',
    html: html,
  });
};

/**
 * Send account activation email with password
 */
exports.sendAccountActivation = async (to, data) => {
  const { name, email, password } = data;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to Trust You Go!</h2>
      <p>Dear ${name},</p>
      <p>Your traveler account has been activated. Here are your login credentials:</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> <span style="font-family: monospace; background: #fff; padding: 5px 10px; border-radius: 4px;">${password}</span></p>
      </div>
      
      <p><strong>Important:</strong> Please change your password after first login.</p>
      
      <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Login to Your Account</a>
      
      <p>Best regards,<br>Trust You Go Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Account Activated - Trust You Go',
    html: html,
  });
};

/**
 * Send password changed notification
 */
exports.sendPasswordChanged = async (to, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Changed</h2>
      <p>Dear ${name},</p>
      <p>Your password has been successfully changed.</p>
      <p>If you did not make this change, please contact us immediately.</p>
      <p>Best regards,<br>Trust You Go Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Password Changed - Trust You Go',
    html: html,
  });
};

/**
 * Test email configuration
 */
exports.testConnection = async () => {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    throw new Error(`Email configuration error: ${error.message}`);
  }
};
```

---

## 🔧 Configuration Files

### **Database Connection** (`src/config/database.js`)

```javascript
const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trust_you_go',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test connection
pool
  .getConnection()
  .then((connection) => {
    logger.success('Database connected successfully');
    connection.release();
  })
  .catch((error) => {
    logger.error('Database connection failed', error);
    process.exit(1);
  });

module.exports = pool;
```

---

## 📝 Environment Variables Template

### **.env.example**

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_PREFIX=/api

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=trust_you_go
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=1h

# Email Configuration (Hostinger)
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=noreply@trustyou-go.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=Trust You Go <noreply@trustyou-go.com>

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://trustyou-go.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Swagger
SWAGGER_ENABLED=true
```

---

## 🎯 Implementation Checklist

### **Phase 1: Core Setup**

- [ ] Create directory structure
- [ ] Install all dependencies
- [ ] Configure database connection
- [ ] Create database migration scripts
- [ ] Set up environment variables
- [ ] Test database connection

### **Phase 2: Utilities & Middleware**

- [ ] Implement response formatters
- [ ] Create helper functions
- [ ] Set up logger
- [ ] Define constants
- [ ] Create authentication middleware
- [ ] Set up file upload middleware
- [ ] Create error handler middleware

### **Phase 3: Models**

- [ ] Admin model
- [ ] Traveler model
- [ ] Agent model
- [ ] Location model
- [ ] Package model
- [ ] Booking model

### **Phase 4: Controllers & Routes**

- [ ] Authentication controller
- [ ] Admin management controller
- [ ] Traveler management controller
- [ ] Agent management controller
- [ ] Location management controller
- [ ] Package management controller
- [ ] Booking management controller

### **Phase 5: Services**

- [ ] Email service
- [ ] Password service
- [ ] File service (thumbnails)
- [ ] Token service

### **Phase 6: Validators**

- [ ] Auth validators
- [ ] Admin validators
- [ ] Location validators
- [ ] Package validators
- [ ] Booking validators

### **Phase 7: Documentation & Testing**

- [ ] Swagger configuration
- [ ] API documentation
- [ ] Postman collection
- [ ] Test all endpoints

---

**Last Updated:** January 3, 2026  
**Version:** 1.0.0  
**Status:** Ready for implementation
