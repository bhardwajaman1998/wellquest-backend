const express = require('express');
const router = express.Router();

const adminRoutes = require('./AdminRoutes');
const customerRoutes = require('./CustomerRoutes')

router.use('/api/admin', adminRoutes);
router.use('/api/customer', customerRoutes)
module.exports = router;
