const express = require('express');
const router = express.Router(); // Use express.Router()

const adminController = require('../controllers/AdminController');

// Signup route
router.post('/signup', adminController.signUp);

// Login route
router.post('/login', adminController.signIn);

module.exports = router;
