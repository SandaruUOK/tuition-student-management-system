const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware Functionality
// Cors allows cross-origin requests from frontend to backend
app.use(cors());

// Express middleware to parse incoming JSON data from HTTP requests
app.use(express.json());

// Express middleware to parse URL-encoded data (e.g. form submissions)
app.use(express.urlencoded({ extended: true }));

// Basic Testing Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount Routes
app.use('/api/health', healthRoutes);

// Import route modules here when features are built
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/classes', classRoutes);

// Centralized Error Handling Middleware
// This must be placed after all routes
app.use(errorHandler);

module.exports = app;
