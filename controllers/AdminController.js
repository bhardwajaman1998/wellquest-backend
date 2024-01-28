const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = process.env.JWT_SECRET;

// Signup endpoint
const signUp = async (req, res) => {
  try {
    const { email, password, username, name } = req.body; // Include the "name" field

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin document
    const admin = new Admin({ email, password: hashedPassword, username, name });

    // Save the admin to the database
    const savedAdmin = await admin.save();
    const token = jwt.sign({ email, username }, secretKey, { expiresIn: '2h' });
    res.status(201).json({ message: 'Admin signed up successfully', admin: savedAdmin, generatedToken: token});
  } catch (error) {
    console.error('Error signing up admin:', error);
    res.status(500).json({ message: 'An error occurred while signing up admin' });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    console.log('Admin Password:', admin.password);
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log('Is Password Valid:', isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create a JWT token
    const token = jwt.sign({ adminId: admin.email }, secretKey, { expiresIn: '2h' });

    res.json({ message: 'Admin logged in successfully', token });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'An error occurred while logging in admin' });
  }
};


module.exports = {
signUp,
signIn
}