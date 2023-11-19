const authController = require('express').Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authController.post('/register', [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    console.log('Received registration request:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    console.log('Checking if user already exists...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already registered');
      return res.status(400).json({ errors: [{ msg: 'User already registered', param: 'email', location: 'body' }] });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating new user...');
    const newUser = await User.create({ email, password: hashedPassword });

    console.log('Generating JWT token...');
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5days' });

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    console.log('Registration successful:', userWithoutPassword);

    return res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Error during registration:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = authController;
