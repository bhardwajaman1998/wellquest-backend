const express = require('express');
const router = express.Router();

// Import other route files
const adminRoutes = require('./AdminRoutes');

// Register routes from other files
router.use('/api/admin', adminRoutes);

// Use additional routes as needed
module.exports = router;
