const mongoose = require('mongoose');

// Import references to the Quiz, Lecture, and User (Instructor) models
const Quiz = require('./Quiz');
const Lecture = require('./Lecture');
const User = require('./User');  // Reference to User model for instructor

// Define the Course schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // Ensuring each course name is unique
  },
  quizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',  // Reference to the Quiz model
    }
  ],
  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',  // Reference to the Lecture model
    }
  ],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model (Instructor)
    required: true,  // Ensures every course has an instructor
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
