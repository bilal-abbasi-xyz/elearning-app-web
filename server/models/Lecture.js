const mongoose = require('mongoose');

// Lecture schema with name and content
const lectureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name of the lecture
  },
  content: {
    type: String,
    required: true, // Content or description of the lecture
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;
