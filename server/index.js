const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authController = require('./controllers/authController');

dotenv.config();

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB has been started successfully'))
    .catch(error => console.error('Error connecting to the database:', error));

const app = express();

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Middleware reached:', req.body); // Move this line here
    next();
});

// Enable CORS
app.use(cors());

// Routes
app.use('/auth', authController);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server has been started successfully on port ${PORT}`));
