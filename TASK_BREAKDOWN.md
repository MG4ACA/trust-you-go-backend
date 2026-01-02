# Backend Implementation - Task Breakdown

## Detailed Step-by-Step Implementation Plan

---

## ✅ Phase 1: Project Setup & Database (Completed in Planning)

- [x] Create backend directory structure
- [x] Create package.json with all dependencies
- [x] Create .env.example configuration template
- [x] Create .gitignore file
- [x] Create README.md with complete documentation
- [x] Create PROJECT_STRUCTURE.md with technical specs
- [x] Design database schema (9 tables including package_requests)

---

## ✅ Phase 2: Database Setup (Completed)

### Task 2.1: Database Scripts

- [x] Create `scripts/createDatabase.js` - Creates MySQL database
- [x] Create `scripts/migrate.js` - Runs all migrations
- [x] Create `scripts/seed.js` - Seeds initial data
- [x] Create `scripts/resetDatabase.js` - Drops and recreates database

### Task 2.2: Migration SQL Files

- [x] Create `src/migrations/001_create_tables.sql` - All 9 tables in one file
- [x] Create `src/migrations/002_seed_data.sql` - Seed data

### Task 2.3: Seed Data

- [x] Create default admin (admin@trustyou-go.com / Admin@2026)
- [x] Add sample locations (Sigiriya, Kandy, Ella, etc.)
- [x] Add sample template packages
- [x] Add sample agents (optional)

**Completed:** ✅

---

## ✅ Phase 3: Core Infrastructure (Completed)

### Task 3.1: Configuration Files

- [x] Create `src/config/database.js` - MySQL connection pool
- [x] Create `src/config/index.js` - Centralized configuration (includes email, JWT, etc.)

### Task 3.2: Utility Functions

- [x] Create `src/utils/response.js` - Success/error response formatters
- [x] Create `src/utils/helpers.js` - Helper functions (UUID, password gen, date)

### Task 3.3: Middleware

- [x] Create `src/middleware/auth.js` - JWT verification & role authorization
- [x] Create `src/middleware/errorHandler.js` - Global error handler
- [x] Create `src/middleware/validate.js` - Request validation middleware

### Task 3.4: Express App Setup

- [x] Create `src/app.js` - Express application configuration
- [x] Create `src/server.js` - Server startup and graceful shutdown
- [x] Configure CORS, Helmet, Morgan logging
- [x] Static file serving for uploads directory
- [x] Health check endpoint

**Completed:** ✅

---

## ✅ Phase 4: Database Models (Completed)

### Task 4.1: Create Model Files

- [x] Create `src/models/Admin.js` - Admin CRUD operations
- [x] Create `src/models/Traveler.js` - Traveler CRUD operations
- [x] Create `src/models/Agent.js` - Agent CRUD operations
- [x] Create `src/models/Location.js` - Location CRUD operations
- [x] Create `src/models/Package.js` - Package CRUD operations
- [x] Create `src/models/Booking.js` - Booking CRUD operations
- [x] Create `src/models/PackageRequest.js` - Package request CRUD operations
- [x] Create `src/models/index.js` - Export all models

### Task 4.2: Model Methods

Each model implements:

- [x] `findById(id)` - Get by ID
- [x] `findAll(filters)` - List with filters
- [x] `create(data)` - Create new record
- [x] `update(id, data)` - Update record
- [x] `delete(id)` - Soft delete (set is_active = false)

### Task 4.3: Complex Queries

- [x] Package with locations (JOIN package_locations + locations + images)
- [x] Booking with relationships (package + traveler + agent)
- [x] Location with images (JOIN location_images)

**Completed:** ✅

---

## ✅ Phase 5: Services Layer (Completed)

### Task 5.1: Authentication Services

- [x] Create `src/services/passwordService.js`
  - [x] Hash password with bcrypt
  - [x] Compare password
  - [x] Generate random password
  - [x] Validate password strength

### Task 5.2: Token Services

- [x] Create `src/services/tokenService.js`
  - [x] Generate JWT token
  - [x] Verify JWT token
  - [x] Decode token
  - [x] Generate admin/traveler specific tokens

### Task 5.3: Email Services

- [x] Create `src/services/emailService.js`
  - [x] Send booking confirmation email
  - [x] Send password change confirmation email
  - [x] Send package request acknowledgment email
  - [x] Test email connection

### Task 5.4: File Services

- [x] Create `src/services/fileService.js`
  - [x] Delete file and directory
  - [x] Get file size and check existence
  - [x] File path/URL conversion
  - [x] Generate unique filename
  - [x] Validate file type and size
  - [x] Placeholder for thumbnail generation (future)

### Task 5.5: Upload Middleware

- [x] Create `src/middleware/upload.js`
  - [x] Multer configuration for location images
  - [x] File type validation
  - [x] File size limits

**Completed:** ✅

---

## 📋 Phase 6: Validators

### Task 6.1: Create Validator Files

- [ ] Create `src/validators/authValidator.js` - Login, password validation
- [ ] Create `src/validators/adminValidator.js` - Admin creation/update
- [ ] Create `src/validators/travelerValidator.js` - Traveler profile
- [ ] Create `src/validators/agentValidator.js` - Agent creation/update
- [ ] Create `src/validators/locationValidator.js` - Location creation/update
- [ ] Create `src/validators/packageValidator.js` - Package creation/update
- [ ] Create `src/validators/bookingValidator.js` - Booking creation/update
- [ ] Create `src/validators/packageRequestValidator.js` - Request validation

### Task 6.2: Validation Rules

Each validator should check:

- [ ] Required fields
- [ ] Data types
- [ ] String lengths
- [ ] Email format
- [ ] Phone number format
- [ ] Date formats
- [ ] Enum values

**Estimated Time:** 3-4 hours

---

## 📋 Phase 7: Controllers

### Task 7.1: Authentication Controller

- [ ] Create `src/controllers/authController.js`
  - [ ] `login` - Admin/Traveler login
  - [ ] `getMe` - Get current user profile
  - [ ] `changePassword` - Change password
  - [ ] `logout` - Logout (optional)

### Task 7.2: Admin Management Controllers

- [ ] Create `src/controllers/adminController.js`
  - [ ] `getAllAdmins` - List admins
  - [ ] `getAdminById` - Get admin by ID
  - [ ] `createAdmin` - Create new admin
  - [ ] `updateAdmin` - Update admin
  - [ ] `deactivateAdmin` - Soft delete admin

### Task 7.3: Traveler Management Controllers

- [ ] Create `src/controllers/travelerController.js`
  - [ ] `getAllTravelers` - List travelers (admin)
  - [ ] `getTravelerById` - Get traveler by ID
  - [ ] `updateTraveler` - Update traveler
  - [ ] `activateTraveler` - Activate traveler account
  - [ ] `deleteTraveler` - Delete traveler
  - [ ] `getMyProfile` - Get own profile (traveler)
  - [ ] `updateMyProfile` - Update own profile (traveler)

### Task 7.4: Agent Controllers

- [ ] Create `src/controllers/agentController.js`
  - [ ] `getAllAgents` - List agents
  - [ ] `getAgentById` - Get agent by ID
  - [ ] `createAgent` - Create agent
  - [ ] `updateAgent` - Update agent
  - [ ] `deactivateAgent` - Soft delete agent

### Task 7.5: Location Controllers

- [ ] Create `src/controllers/locationController.js`
  - [ ] `getAllLocations` - List locations
  - [ ] `getLocationById` - Get location with images
  - [ ] `createLocation` - Create location
  - [ ] `updateLocation` - Update location
  - [ ] `deactivateLocation` - Soft delete location
  - [ ] `uploadImage` - Upload image to location
  - [ ] `deleteImage` - Delete location image
  - [ ] `reorderImages` - Reorder images

### Task 7.6: Package Controllers

- [ ] Create `src/controllers/packageController.js`
  - [ ] `getAllPackages` - List packages (with filters)
  - [ ] `getPackageById` - Get package with full itinerary
  - [ ] `createPackage` - Create package
  - [ ] `updatePackage` - Update package
  - [ ] `deactivatePackage` - Soft delete package
  - [ ] `publishPackage` - Publish draft package
  - [ ] `unpublishPackage` - Unpublish to draft
  - [ ] `duplicatePackage` - Clone package
  - [ ] `updateItinerary` - Update package itinerary

### Task 7.7: Booking Controllers

- [ ] Create `src/controllers/bookingController.js`
  - [ ] `submitBooking` - Public booking submission (creates traveler)
  - [ ] `getAllBookings` - List bookings (admin)
  - [ ] `getBookingById` - Get booking details
  - [ ] `confirmBooking` - Confirm booking + activate traveler + send email
  - [ ] `cancelBooking` - Cancel booking
  - [ ] `updateBookingStatus` - Update status
  - [ ] `updateBooking` - Update booking details
  - [ ] `getMyBookings` - Get traveler's bookings
  - [ ] `getMyBookingById` - Get traveler's booking details

### Task 7.8: Package Request Controllers

- [ ] Create `src/controllers/packageRequestController.js`
  - [ ] `submitRequest` - Traveler submits custom package request
  - [ ] `getMyRequests` - Traveler's requests
  - [ ] `getMyRequestById` - Traveler's request details
  - [ ] `getAllRequests` - Admin list all requests
  - [ ] `getRequestById` - Admin get request details
  - [ ] `updateRequestStatus` - Admin update status
  - [ ] `createPackageFromRequest` - Admin creates package from request

**Estimated Time:** 10-12 hours

---

## 📋 Phase 8: Routes

### Task 8.1: Create Route Files

- [ ] Create `src/routes/auth.routes.js` - Authentication endpoints
- [ ] Create `src/routes/admin.routes.js` - Admin management
- [ ] Create `src/routes/traveler.routes.js` - Traveler management
- [ ] Create `src/routes/agent.routes.js` - Agent CRUD
- [ ] Create `src/routes/location.routes.js` - Location + images
- [ ] Create `src/routes/package.routes.js` - Package management
- [ ] Create `src/routes/booking.routes.js` - Booking workflow
- [ ] Create `src/routes/packageRequest.routes.js` - Package requests
- [ ] Create `src/routes/index.js` - Route aggregator

### Task 8.2: Apply Middleware

- [ ] Authentication middleware on protected routes
- [ ] Role authorization (admin vs traveler)
- [ ] Validation middleware on all endpoints
- [ ] File upload middleware on image endpoints

**Estimated Time:** 4-5 hours

---

## 📋 Phase 9: Express App Setup

### Task 9.1: App Configuration

- [ ] Create `src/app.js`
  - [ ] Initialize Express
  - [ ] Configure middleware (helmet, cors, morgan, body-parser)
  - [ ] Mount routes
  - [ ] Add 404 handler
  - [ ] Add error handler

### Task 9.2: Server Entry Point

- [ ] Create `server.js`
  - [ ] Load environment variables
  - [ ] Initialize database connection
  - [ ] Start Express server
  - [ ] Handle graceful shutdown

**Estimated Time:** 2-3 hours

---

## 📋 Phase 10: Swagger Documentation

### Task 10.1: Swagger Configuration

- [ ] Create `src/swagger.js`
  - [ ] Configure swagger-jsdoc
  - [ ] Set up swagger-ui-express
  - [ ] Define API info and servers

### Task 10.2: API Documentation

- [ ] Document authentication endpoints
- [ ] Document admin endpoints
- [ ] Document traveler endpoints
- [ ] Document agent endpoints
- [ ] Document location endpoints
- [ ] Document package endpoints
- [ ] Document booking endpoints
- [ ] Document package request endpoints

### Task 10.3: Schema Definitions

- [ ] Define request schemas
- [ ] Define response schemas
- [ ] Define error schemas
- [ ] Add authentication documentation

**Estimated Time:** 5-6 hours

---

## 📋 Phase 11: Testing & Validation

### Task 11.1: Manual Testing

- [ ] Test database connection
- [ ] Test admin login
- [ ] Test traveler login
- [ ] Test all CRUD operations
- [ ] Test file upload
- [ ] Test email sending
- [ ] Test booking workflow
- [ ] Test package request workflow

### Task 11.2: Create Test Data

- [ ] Create test locations
- [ ] Create test packages
- [ ] Create test bookings
- [ ] Create test package requests

### Task 11.3: Postman Collection

- [ ] Create Postman collection
- [ ] Add all endpoints
- [ ] Add environment variables
- [ ] Add authentication
- [ ] Export collection

### Task 11.4: Documentation Review

- [ ] Verify all endpoints work
- [ ] Update README if needed
- [ ] Add troubleshooting tips
- [ ] Document common errors

**Estimated Time:** 6-8 hours

---

## 📋 Phase 12: Frontend Integration

### Task 12.1: API Configuration

- [ ] Update frontend axios configuration
- [ ] Point to backend URL (http://localhost:3000)
- [ ] Configure authentication headers
- [ ] Handle token refresh

### Task 12.2: Admin Portal Integration

- [ ] Update admin login
- [ ] Update admin CRUD operations
- [ ] Update location management
- [ ] Update package management
- [ ] Update booking management

### Task 12.3: SPA Integration

- [ ] Update package listing
- [ ] Update package details
- [ ] Update location listing
- [ ] Update booking submission

**Estimated Time:** 4-6 hours (frontend work)

---

## 📊 Total Estimated Time

| Phase    | Description         | Time        |
| -------- | ------------------- | ----------- |
| Phase 1  | Project Setup       | ✅ Done     |
| Phase 2  | Database Setup      | 3-4 hours   |
| Phase 3  | Core Infrastructure | 4-5 hours   |
| Phase 4  | Database Models     | 6-8 hours   |
| Phase 5  | Services Layer      | 4-5 hours   |
| Phase 6  | Validators          | 3-4 hours   |
| Phase 7  | Controllers         | 10-12 hours |
| Phase 8  | Routes              | 4-5 hours   |
| Phase 9  | Express App         | 2-3 hours   |
| Phase 10 | Swagger Docs        | 5-6 hours   |
| Phase 11 | Testing             | 6-8 hours   |
| Phase 12 | Integration         | 4-6 hours   |

**Total:** 51-66 hours (approx 7-9 working days)

---

## 🚀 Quick Start Checklist

After implementation is complete:

1. [ ] Clone/pull backend directory
2. [ ] Run `npm install`
3. [ ] Copy `.env.example` to `.env`
4. [ ] Update `.env` with your MySQL credentials
5. [ ] Run `npm run db:create` to create database
6. [ ] Run `npm run db:migrate` to create tables
7. [ ] Run `npm run db:seed` to add default admin
8. [ ] Run `npm run dev` to start server
9. [ ] Visit `http://localhost:3000/api-docs` for Swagger
10. [ ] Test login with admin@trustyou-go.com / Admin@2026
11. [ ] Change default admin password
12. [ ] Update frontend API URL
13. [ ] Test frontend integration

---

## 📝 Notes

### Priority Order

1. **Critical:** Phase 2-4 (Database + Models) - Core foundation
2. **High:** Phase 5-7 (Services + Validators + Controllers) - Business logic
3. **Medium:** Phase 8-9 (Routes + App) - API exposure
4. **Low:** Phase 10 (Swagger) - Documentation (can be added later)
5. **Testing:** Phase 11 - Throughout development

### Development Approach

- Work on one phase at a time
- Test each phase before moving to next
- Keep mock server running alongside (port 3001)
- Gradually migrate frontend to new backend (port 3000)

### Common Issues

- MySQL connection errors → Check credentials in .env
- JWT errors → Ensure JWT_SECRET is set
- Email errors → Verify Hostinger SMTP settings
- File upload errors → Check uploads/ directory permissions

---

**Last Updated:** January 3, 2026  
**Status:** Ready to start Phase 2 (Database Setup)  
**Next Step:** Create database migration scripts
