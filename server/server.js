require('dotenv').config();  // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const courseRoutes = require('./routes/courseRoutes');  // Add this line to import the routes
const quizRoutes = require('./routes/quizRoutes');  // Import quiz routes
const lectureRoutes = require('./routes/lectureRoutes'); // Adjust the path if needed
const userRoutes = require('./routes/userRoutes'); // Adjust the path if needed
const authRoutes = require('./routes/authRoutes'); // Adjust the path if needed

// Initialize the app
const app = express();

// Middleware
app.use(cors());  // Allow cross-origin requests (for frontend to backend)
app.use(bodyParser.json());  // Parse incoming JSON requests

// Database connection (MongoDB)
const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/elearning-app-tse';
console.log('MongoDB URI:', dbURI);  // Log the URI for debugging

mongoose
  .connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

console.log(`checking terminal`);

app.use((req, res, next) => {
  console.log(`Request received at ${req.method} ${req.url}`);
  next();
});
app.use('/api', authRoutes);
app.use('/api', courseRoutes);  // This line will allow POST /api/courses, etc.
app.use('/api', quizRoutes);  // Use quiz routes under "/api"
app.use('/api', lectureRoutes); // Mount the routes for lectures
app.use('/api', userRoutes); // Mount the routes for lectures

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello, welcome to the MEAN stack API!');
});

// Set the server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
