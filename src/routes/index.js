const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const travelerRoutes = require('./traveler.routes');
const agentRoutes = require('./agent.routes');
const locationRoutes = require('./location.routes');
const packageRoutes = require('./package.routes');
const bookingRoutes = require('./booking.routes');
const packageRequestRoutes = require('./packageRequest.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/admins', adminRoutes);
router.use('/travelers', travelerRoutes);
router.use('/agents', agentRoutes);
router.use('/locations', locationRoutes);
router.use('/packages', packageRoutes);
router.use('/bookings', bookingRoutes);
router.use('/package-requests', packageRequestRoutes);

module.exports = router;
