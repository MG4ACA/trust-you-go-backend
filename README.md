# Trust You Go - Backend API

## Express.js + MySQL REST API Server

---

## 📋 Project Overview

RESTful API backend for Trust You Go travel booking management system built with Express.js and MySQL.

### **Tech Stack**
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Database:** MySQL 8.0+
- **Authentication:** JWT + bcrypt
- **Email:** Nodemailer (Hostinger SMTP)
- **File Upload:** Multer (Local file system)
- **Documentation:** Swagger/OpenAPI 3.0
- **Validation:** express-validator

### **Key Features**
- ✅ JWT Authentication with 1-hour token expiry
- ✅ Role-based access control (Admin, Traveler)
- ✅ Auto traveler account creation on booking
- ✅ Image upload with automatic thumbnail generation
- ✅ Email notifications (booking confirmation, password reset)
- ✅ Package itinerary builder
- ✅ Draft/Published package status
- ✅ Custom package requests
- ✅ Comprehensive API documentation

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- MySQL 8.0+ installed and running
- Git

### **Installation**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your configuration
# Update DB credentials, JWT secret, email settings

# Create database and run migrations
npm run db:create
npm run db:migrate

# Seed initial data (default admin)
npm run db:seed

# Start development server
npm run dev
```

Server will start on: `http://localhost:3000`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL connection pool
│   │   ├── email.js             # Nodemailer configuration
│   │   └── jwt.js               # JWT secret & expiry config
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── validator.js         # Request validation
│   │   └── upload.js            # Multer file upload config
│   │
│   ├── models/
│   │   ├── Admin.js             # Admin model (queries)
│   │   ├── Traveler.js          # Traveler model
│   │   ├── Agent.js             # Agent model
│   │   ├── Location.js          # Location model
│   │   ├── Package.js           # Package model
│   │   ├── Booking.js           # Booking model
│   │   └── index.js             # Model exports
│   │
│   ├── controllers/
│   │   ├── authController.js    # Login, logout, password
│   │   ├── adminController.js   # Admin CRUD
│   │   ├── travelerController.js # Traveler management
│   │   ├── agentController.js   # Agent CRUD
│   │   ├── locationController.js # Location + image upload
│   │   ├── packageController.js # Package + itinerary
│   │   └── bookingController.js # Booking workflow
│   │
│   ├── routes/
│   │   ├── auth.routes.js       # /api/auth/*
│   │   ├── admin.routes.js      # /api/admin/*
│   │   ├── traveler.routes.js   # /api/traveler/*
│   │   ├── agent.routes.js      # /api/agents/*
│   │   ├── location.routes.js   # /api/locations/*
│   │   ├── package.routes.js    # /api/packages/*
│   │   ├── booking.routes.js    # /api/bookings/*
│   │   └── index.js             # Route aggregator
│   │
│   ├── services/
│   │   ├── emailService.js      # Email sending (Nodemailer)
│   │   ├── passwordService.js   # Password generation & hashing
│   │   ├── fileService.js       # Image processing & thumbnails
│   │   └── tokenService.js      # JWT token operations
│   │
│   ├── utils/
│   │   ├── response.js          # Standard response format
│   │   ├── logger.js            # Console logging utility
│   │   ├── helpers.js           # Common helper functions
│   │   └── constants.js         # App-wide constants
│   │
│   ├── migrations/
│   │   ├── 001_create_tables.sql      # Initial schema
│   │   └── 002_seed_data.sql          # Default admin + samples
│   │
│   ├── validators/
│   │   ├── authValidator.js     # Auth input validation
│   │   ├── adminValidator.js    # Admin input validation
│   │   ├── locationValidator.js # Location validation
│   │   ├── packageValidator.js  # Package validation
│   │   └── bookingValidator.js  # Booking validation
│   │
│   ├── app.js                   # Express app configuration
│   └── swagger.js               # Swagger documentation setup
│
├── uploads/                     # Uploaded files (local storage)
│   └── locations/              # Location images
│       └── {location_id}/      # Per-location folders
│
├── tests/                       # Test files (optional)
│   └── api/
│
├── .env                         # Environment variables (not committed)
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── server.js                    # Entry point
└── README.md                    # This file
```

---

## 🗄️ Database Schema

### **Tables (9 Total)**

1. **admins** - Admin user accounts
2. **travelers** - Traveler accounts (auto-created on booking)
3. **agents** - Agent/referral information
4. **locations** - Tourist spots, accommodations, etc.
5. **location_images** - Images for locations
6. **packages** - Travel packages (template & custom)
7. **package_locations** - Junction table (packages ↔ locations)
8. **bookings** - Booking records
9. **package_requests** - Custom package requests from travelers

**Note:** Audit logs table removed as per requirements.

### **Database Setup**

```bash
# Create database
npm run db:create

# Run migrations (create all tables)
npm run db:migrate

# Seed initial data
npm run db:seed

# Reset database (drop and recreate)
npm run db:reset
```

### **Default Admin Account**
```
Email: admin@trustyou-go.com
Password: Admin@2026
Contact: +94XXXXXXXXX
```

**⚠️ IMPORTANT:** Change the default password after first login!

---

## 🔐 Authentication

### **JWT Token System**
- **Token Type:** Bearer token
- **Expiry:** 1 hour
- **Algorithm:** HS256
- **Header:** `Authorization: Bearer <token>`

### **Login Flow**

1. **Admin Login:**
   ```
   POST /api/auth/login
   Body: { "email": "admin@trustyou-go.com", "password": "Admin@2026" }
   ```

2. **Traveler Login:**
   ```
   POST /api/auth/login
   Body: { "email": "traveler@example.com", "password": "auto-generated-password" }
   ```

3. **Response:**
   ```json
   {
     "success": true,
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": {
         "id": "uuid",
         "email": "admin@trustyou-go.com",
         "name": "Admin User",
         "role": "admin"
       }
     }
   }
   ```

### **Protected Routes**
All routes except `/api/auth/login` and public endpoints require JWT token:

```javascript
headers: {
  'Authorization': 'Bearer <your-token>'
}
```

---

## 📡 API Endpoints

### **Authentication Endpoints**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Admin/Traveler login |
| GET | `/api/auth/me` | Protected | Get current user |
| PUT | `/api/auth/password` | Protected | Change password |
| POST | `/api/auth/logout` | Protected | Logout (optional) |

---

### **Public Endpoints (No Auth)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/packages` | List active published packages |
| GET | `/api/packages/:id` | Get package with full itinerary |
| GET | `/api/locations` | List active locations |
| GET | `/api/locations/:id` | Get location with images |
| POST | `/api/bookings` | Submit booking request |

---

### **Admin Endpoints (Auth: Admin)**

#### **Admin Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/admins` | List all admins |
| GET | `/api/admin/admins/:id` | Get admin by ID |
| POST | `/api/admin/admins` | Create new admin |
| PUT | `/api/admin/admins/:id` | Update admin |
| DELETE | `/api/admin/admins/:id` | Deactivate admin |

#### **Traveler Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/travelers` | List all travelers |
| GET | `/api/admin/travelers/:id` | Get traveler by ID |
| PUT | `/api/admin/travelers/:id` | Update traveler |
| PUT | `/api/admin/travelers/:id/activate` | Activate traveler |
| DELETE | `/api/admin/travelers/:id` | Delete traveler |

#### **Agent Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents` | List all agents |
| GET | `/api/agents/:id` | Get agent by ID |
| POST | `/api/agents` | Create agent |
| PUT | `/api/agents/:id` | Update agent |
| DELETE | `/api/agents/:id` | Deactivate agent |

#### **Location Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/locations` | List all locations (incl. inactive) |
| POST | `/api/locations` | Create location |
| PUT | `/api/locations/:id` | Update location |
| DELETE | `/api/locations/:id` | Deactivate location |
| POST | `/api/locations/:id/images` | Upload image |
| DELETE | `/api/locations/:id/images/:imageId` | Delete image |
| PUT | `/api/locations/:id/images/reorder` | Reorder images |

#### **Package Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/packages` | List all packages (incl. drafts) |
| POST | `/api/packages` | Create package |
| PUT | `/api/packages/:id` | Update package |
| PUT | `/api/packages/:id/publish` | Publish package (draft → published) |
| PUT | `/api/packages/:id/unpublish` | Unpublish package |
| DELETE | `/api/packages/:id` | Deactivate package |
| POST | `/api/packages/:id/duplicate` | Duplicate package |
| PUT | `/api/packages/:id/itinerary` | Update itinerary |

#### **Booking Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/bookings` | List all bookings (with filters) |
| GET | `/api/bookings/:id` | Get booking details |
| PUT | `/api/bookings/:id/confirm` | Confirm booking + activate traveler |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| PUT | `/api/bookings/:id/status` | Update booking status |
| PUT | `/api/bookings/:id` | Update booking details |

---

### **Traveler Endpoints (Auth: Traveler)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/traveler/profile` | Get my profile |
| PUT | `/api/traveler/profile`-requests` | Request custom package |
| GET | `/api/traveler/package-requests` | Get my package requests |
| GET | `/api/traveler/package-requests/:id` | Get request details |

### **Admin - Package Request Management**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/package-requests` | List all requests (with filters) |
| GET | `/api/admin/package-requests/:id` | Get request details |
| PUT | `/api/admin/package-requests/:id/status` | Update request status |
| POST | `/api/admin/package-requests/:id/create-package` | Create package from request
| GET | `/api/traveler/bookings` | Get my bookings |
| GET | `/api/traveler/bookings/:id` | Get my booking details |
| POST | `/api/traveler/packages/request` | Request custom package |

---

## 📥 Request/Response Format

### **Success Response**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Example"
  }
}
```

### **Error Response**
```json
{
  "success": false,
  "error": {
    "message": "Resource not found",
    "code": "NOT_FOUND"
  }
}
```

### **Validation Error**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## 📤 File Upload

### **Location Images**

**Endpoint:** `POST /api/locations/:id/images`

**Headers:**
``Storage path: `uploads/locations/{location_id}/`
- Returns image URL

**Note:** Thumbnail generation feature will be implemented in future updates.
```

**Body:**
```
image: <file> (JPEG, PNG, WebP)
displayOrder: <number> (optional)
```

**Features:**
- Maximum file size: 5MB
- Allowed formats: JPnull,
    "display_order": 0
  }
}
```

**Note:** `thumbnail_url` will be null until thumbnail generation is implemented.
**Response:**
```json
{
  "success": true,
  "data": {
    "image_id": "uuid",
    "image_url": "/uploads/locations/uuid/image.jpg",
    "thumbnail_url": "/uploads/locations/uuid/thumb_image.jpg",
    "display_order": 0
  }
}
```

---

## 📧 Email Service

### **Hostinger SMTP Configuration**

Emails are sent via Nodemailer using Hostinger SMTP:

**Templates:**
1. **Booking Confirmation** - Sent when admin confirms booking
2. **Traveler Account Activation** - Sent with auto-generated password
3. **Password Changed** - Sent when user changes password

**Configuration in .env:**
```env
EMAIL_HOST=info@trustyou-go.com
EMAIL_PASSWORD=your_hostinger_email_password
EMAIL_FROM=Trust You Go <info
EMAIL_USER=noreply@trustyou-go.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=Trust You Go <noreply@trustyou-go.com>
```

---

## 🔄 Booking Workflow

### **Step 1: Public User Submits Booking**

```
POST /api/bookings
Body: {
  "packageId": "uuid",
  "travelerName": "John Doe",
  "travelerEmail": "john@example.com",
  "travelerContact": "+94712345678",
  "noOfTravelers": 2,
  "startDate": "2026-03-01",
  "endDate": "2026-03-05",
  "agentId": "uuid" (optional),
  "travelerNotes": "Special requirements..."
}
```

**Backend Actions:**
1. Validate package exists and is active
2. Create traveler account with:
   - Auto-generated password (e.g., `Ty2026!xY7p`)
   - `is_active = false` (cannot login yet)
3. Create booking with:
   - `status = 'temporary'`
   - Link to traveler_id
4. Return success message

---

### **Step 2: Admin Confirms Booking**

```
PUT /api/bookings/:id/confirm
Body: {
  "totalAmount": 150000.00,
  "adminNotes": "Confirmed via phone"
}
```

**Backend Actions:**
1. Update booking:
   - `status = 'confirmed'`
   - `confirmation_date = NOW()`
   - `confirmed_by = admin_id`
   - `total_amount = 150000.00`
2. Activate traveler:
   - `is_active = true`
3. Send email to traveler:
   - Booking confirmation details
   - Login credentials (email + auto-generated password)
   - Link to traveler portal

---

### **Step 3: Traveler Can Now Login**

```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "Ty2026!xY7p"
}
```

Traveler can:
- View booking details
- Update profile
- Change password
- Request custom packages

---

## 🎨 Package Status Flow

### **Draft → Published → Inactive**

**Draft Status:**
- Created by admin but not visible to public
- Can be edited freely
- Not bookable by travelers

**Published Status:**
- Visible to public on frontend
- Bookable by travelers
- Shows on package listing

**Inactive Status:**
- Soft deleted (is_active = false)
- Not visible to public
- Existing bookings preserved

**Endpoints:**
```
PUT /api/packages/:id/publish    # Draft → Published
PUT /api/packages/:id/unpublish  # Published → Draft
DELETE /api/packages/:id         # Any → Inactive
```

---

## 🧪 Testing

### **Run Tests**
```bash
npm test                  # Run all tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests
npm run test:coverage    # Coverage report
```

### **API Testing Tools**
- **Swagger UI:** `http://localhost:3000/api-docs`
- **Postman Collection:** Import `postman_collection.json`
- **Thunder Client:** VS Code extension

### **Sample Test Requests**

See [TESTING.md](./TESTING.md) for comprehensive test scenarios.

---

## 📊 Database Queries Optimization

### **Indexes Created**
- Email lookups (admins, travelers, agents)
- Status filters (all tables with is_active)
- Foreign key relationships
- Date range queries (bookings)
- Location type filtering

### **N+1 Query Prevention**
- Package with locations uses JOINs
- Booking with package/agent/traveler uses JOINs
- Location with images uses JOINs

---

## 🚀 Deployment

### **Development**
```bash
npm run dev    # Runs with nodemon (auto-restart)
```

### **Production**
```bash
npm start      # Runs with node
```

### **Environment**
- Copy `.env.example` to `.env`
- Update all configuration values
- Never commit `.env` to Git

### **Database Migration**
```bash
# Production database setup
npm run db:migrate:prod
```

---

## 🔒 Security Features

- [x] Password hashing with bcrypt (cost: 10)
- [x] JWT tokens with 1-hour expiry
- [x] SQL injection prevention (parameterized queries)
- [x] XSS protection (helmet middleware)
- [x] CORS configuration (trustyou-go.com)
- [x] File upload validation (size, type)
- [x] Input validation on all endpoints
- [x] Rate limiting (optional, not implemented)

---

## 📝 NPM Scripts

```json
{
  "dev": "nodemon server.js",
  "start": "node server.js",
  "db:create": "node scripts/createDatabase.js",
  "db:migrate": "node scripts/migrate.js",
  "db:seed": "node scripts/seed.js",
  "db:reset": "node scripts/resetDatabase.js",
  "test": "jest",
  "test:watch": "jest --watch",
  "lint": "eslint src/",
  "format": "prettier --write \"src/**/*.js\""
}
```

---

## 📚 API Documentation

### **Swagger UI**
Once server is running, visit:
```
http://localhost:3000/api-docs
```

Interactive API documentation with:
- All endpoints listed
- Request/response schemas
- Try-it-out functionality
- Authentication support

---

## 🐛 Troubleshooting

### **Cannot connect to MySQL**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p

# Grant privileges
GRANT ALL PRIVILEGES ON trust_you_go.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### **JWT Token expired**
- Tokens expire after 1 hour
- Frontend should implement token refresh
- User needs to login again

### **Image upload fails**
- Check `uploads/` directory exists and is writable
- Check file size < 5MB
- Check file format (JPEG, PNG, WebP only)

---

## 📞 Support

For issues or questions:
- Email: dev@trustyou-go.com
- Documentation: `/docs`
- API Docs: `http://localhost:3000/api-docs`

---

## 📄 License

Proprietary - Trust You Go © 2026

---

**Last Updated:** January 3, 2026  
**Version:** 1.0.0  
**Node.js:** 18+  
**MySQL:** 8.0+
