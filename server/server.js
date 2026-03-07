const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Basic Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import route modules here when features are built
// app.use('/api/users', userRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/classes', classRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
