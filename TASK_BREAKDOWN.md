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

## ✅ Phase 6: Validators (Completed)

### Task 6.1: Create Validator Files

- [x] Create `src/validators/authValidator.js` - Login, password validation
- [x] Create `src/validators/adminValidator.js` - Admin creation/update
- [x] Create `src/validators/travelerValidator.js` - Traveler profile
- [x] Create `src/validators/agentValidator.js` - Agent creation/update
- [x] Create `src/validators/locationValidator.js` - Location creation/update
- [x] Create `src/validators/packageValidator.js` - Package creation/update
- [x] Create `src/validators/bookingValidator.js` - Booking creation/update
- [x] Create `src/validators/packageRequestValidator.js` - Request validation

### Task 6.2: Validation Rules

Each validator checks:

- [x] Required fields
- [x] Data types
- [x] String lengths
- [x] Email format
- [x] Phone number format
- [x] Date formats
- [x] Enum values

**Completed:** ✅

---

## ✅ Phase 7: Controllers (Completed)

### Task 7.1: Authentication Controller

- [x] Create `src/controllers/authController.js`
  - [x] `login` - Admin/Traveler login
  - [x] `getMe` - Get current user profile
  - [x] `changePassword` - Change password
  - [x] `logout` - Logout (optional)

### Task 7.2: Admin Management Controllers

- [x] Create `src/controllers/adminController.js`
  - [x] `getAllAdmins` - List admins
  - [x] `getAdminById` - Get admin by ID
  - [x] `createAdmin` - Create new admin
  - [x] `updateAdmin` - Update admin
  - [x] `deleteAdmin` - Soft delete admin

### Task 7.3: Traveler Management Controllers

- [x] Create `src/controllers/travelerController.js`
  - [x] `getAllTravelers` - List travelers (admin)
  - [x] `getTravelerById` - Get traveler by ID
  - [x] `updateTraveler` - Update traveler
  - [x] `activateTraveler` - Activate traveler account
  - [x] `deleteTraveler` - Delete traveler

### Task 7.4: Agent Controllers

- [x] Create `src/controllers/agentController.js`
  - [x] `getAllAgents` - List agents
  - [x] `getAgentById` - Get agent by ID
  - [x] `getAgentWithStats` - Get agent with statistics
  - [x] `createAgent` - Create agent
  - [x] `updateAgent` - Update agent
  - [x] `deleteAgent` - Delete agent

### Task 7.5: Location Controllers

- [x] Create `src/controllers/locationController.js`
  - [x] `getAllLocations` - List locations
  - [x] `getLocationById` - Get location with images
  - [x] `createLocation` - Create location
  - [x] `updateLocation` - Update location
  - [x] `deleteLocation` - Delete location
  - [x] `uploadImage` - Upload image to location
  - [x] `deleteImage` - Delete location image
  - [x] `reorderImages` - Reorder images

### Task 7.6: Package Controllers

- [x] Create `src/controllers/packageController.js`
  - [x] `getAllPackages` - List packages (with filters)
  - [x] `getPackageById` - Get package with full itinerary
  - [x] `createPackage` - Create package
  - [x] `updatePackage` - Update package
  - [x] `deletePackage` - Delete package
  - [x] `publishPackage` - Publish draft package
  - [x] `unpublishPackage` - Unpublish to draft
  - [x] `duplicatePackage` - Clone package
  - [x] `updateItinerary` - Update package itinerary

### Task 7.7: Booking Controllers

- [x] Create `src/controllers/bookingController.js`
  - [x] `submitBooking` - Public booking submission (creates traveler)
  - [x] `getAllBookings` - List bookings (admin)
  - [x] `getBookingById` - Get booking details
  - [x] `confirmBooking` - Confirm booking + activate traveler + send email
  - [x] `cancelBooking` - Cancel booking
  - [x] `updateBookingStatus` - Update status
  - [x] `updateBooking` - Update booking details
  - [x] `getTravelerBookings` - Get traveler's bookings
  - [x] `getBookingStats` - Get booking statistics

### Task 7.8: Package Request Controllers

- [x] Create `src/controllers/packageRequestController.js`
  - [x] `createPackageRequest` - Traveler submits custom package request
  - [x] `getTravelerPackageRequests` - Traveler's requests
  - [x] `getPackageRequestById` - Get request details
  - [x] `getAllPackageRequests` - Admin list all requests
  - [x] `updatePackageRequestStatus` - Admin update status
  - [x] `approvePackageRequest` - Admin approve request
  - [x] `rejectPackageRequest` - Admin reject request
  - [x] `getPackageRequestStats` - Get request statistics

**Completed:** ✅

---

## ✅ Phase 8: Routes (Completed)

### Task 8.1: Create Route Files

- [x] Create `src/routes/auth.routes.js` - Authentication endpoints
- [x] Create `src/routes/admin.routes.js` - Admin management
- [x] Create `src/routes/traveler.routes.js` - Traveler management
- [x] Create `src/routes/agent.routes.js` - Agent CRUD
- [x] Create `src/routes/location.routes.js` - Location + images
- [x] Create `src/routes/package.routes.js` - Package management
- [x] Create `src/routes/booking.routes.js` - Booking workflow
- [x] Create `src/routes/packageRequest.routes.js` - Package requests
- [x] Create `src/routes/index.js` - Route aggregator

### Task 8.2: Apply Middleware

- [x] Authentication middleware on protected routes
- [x] Role authorization (admin vs traveler)
- [x] Validation middleware on all endpoints
- [x] File upload middleware on image endpoints

**Completed:** ✅

---

## ✅ Phase 9: Express App Setup (Completed)

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
