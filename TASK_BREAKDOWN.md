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

## 📋 Phase 2: Database Setup (Next Step)

### Task 2.1: Database Scripts
- [ ] Create `scripts/createDatabase.js` - Creates MySQL database
- [ ] Create `scripts/migrate.js` - Runs all migrations
- [ ] Create `scripts/seed.js` - Seeds initial data
- [ ] Create `scripts/resetDatabase.js` - Drops and recreates database

### Task 2.2: Migration SQL Files
- [ ] Create `src/migrations/001_create_admins_table.sql`
- [ ] Create `src/migrations/002_create_travelers_table.sql`
- [ ] Create `src/migrations/003_create_agents_table.sql`
- [ ] Create `src/migrations/004_create_locations_table.sql`
- [ ] Create `src/migrations/005_create_location_images_table.sql`
- [ ] Create `src/migrations/006_create_packages_table.sql`
- [ ] Create `src/migrations/007_create_package_locations_table.sql`
- [ ] Create `src/migrations/008_create_bookings_table.sql`
- [ ] Create `src/migrations/009_create_package_requests_table.sql`

### Task 2.3: Seed Data
- [ ] Create default admin (admin@trustyou-go.com / Admin@2026)
- [ ] Add sample locations (Sigiriya, Kandy, Ella, etc.)
- [ ] Add sample template packages
- [ ] Add sample agents (optional)

**Estimated Time:** 3-4 hours

---

## 📋 Phase 3: Core Infrastructure (Config & Utils)

### Task 3.1: Configuration Files
- [ ] Create `src/config/database.js` - MySQL connection pool
- [ ] Create `src/config/email.js` - Nodemailer configuration
- [ ] Create `src/config/jwt.js` - JWT configuration

### Task 3.2: Utility Functions
- [ ] Create `src/utils/response.js` - Success/error response formatters
- [ ] Create `src/utils/helpers.js` - Helper functions (UUID, password gen, date)
- [ ] Create `src/utils/logger.js` - Console logger with colors
- [ ] Create `src/utils/constants.js` - Application constants

### Task 3.3: Middleware
- [ ] Create `src/middleware/auth.js` - JWT verification & role authorization
- [ ] Create `src/middleware/errorHandler.js` - Global error handler
- [ ] Create `src/middleware/upload.js` - Multer file upload configuration
- [ ] Create `src/middleware/validator.js` - Request validation middleware

**Estimated Time:** 4-5 hours

---

## 📋 Phase 4: Database Models

### Task 4.1: Create Model Files
- [ ] Create `src/models/Admin.js` - Admin CRUD operations
- [ ] Create `src/models/Traveler.js` - Traveler CRUD operations
- [ ] Create `src/models/Agent.js` - Agent CRUD operations
- [ ] Create `src/models/Location.js` - Location CRUD operations
- [ ] Create `src/models/Package.js` - Package CRUD operations
- [ ] Create `src/models/Booking.js` - Booking CRUD operations
- [ ] Create `src/models/PackageRequest.js` - Package request CRUD operations
- [ ] Create `src/models/index.js` - Export all models

### Task 4.2: Model Methods
Each model should implement:
- [ ] `findById(id)` - Get by ID
- [ ] `findAll(filters)` - List with filters
- [ ] `create(data)` - Create new record
- [ ] `update(id, data)` - Update record
- [ ] `delete(id)` - Soft delete (set is_active = false)

### Task 4.3: Complex Queries
- [ ] Package with locations (JOIN package_locations + locations + images)
- [ ] Booking with relationships (package + traveler + agent)
- [ ] Location with images (JOIN location_images)

**Estimated Time:** 6-8 hours

---

## 📋 Phase 5: Services Layer

### Task 5.1: Authentication Services
- [ ] Create `src/services/passwordService.js`
  - [ ] Hash password with bcrypt
  - [ ] Compare password
  - [ ] Generate random password

### Task 5.2: Token Services
- [ ] Create `src/services/tokenService.js`
  - [ ] Generate JWT token
  - [ ] Verify JWT token
  - [ ] Decode token

### Task 5.3: Email Services
- [ ] Create `src/services/emailService.js`
  - [ ] Send booking confirmation email
  - [ ] Send account activation email (with password)
  - [ ] Send password changed email
  - [ ] Test email connection

### Task 5.4: File Services
- [ ] Create `src/services/fileService.js`
  - [ ] Delete file
  - [ ] Delete directory
  - [ ] Get file size
  - [ ] Convert file path to URL
  - [ ] Placeholder for thumbnail generation (future)

**Estimated Time:** 4-5 hours

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

| Phase | Description | Time |
|-------|-------------|------|
| Phase 1 | Project Setup | ✅ Done |
| Phase 2 | Database Setup | 3-4 hours |
| Phase 3 | Core Infrastructure | 4-5 hours |
| Phase 4 | Database Models | 6-8 hours |
| Phase 5 | Services Layer | 4-5 hours |
| Phase 6 | Validators | 3-4 hours |
| Phase 7 | Controllers | 10-12 hours |
| Phase 8 | Routes | 4-5 hours |
| Phase 9 | Express App | 2-3 hours |
| Phase 10 | Swagger Docs | 5-6 hours |
| Phase 11 | Testing | 6-8 hours |
| Phase 12 | Integration | 4-6 hours |

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
