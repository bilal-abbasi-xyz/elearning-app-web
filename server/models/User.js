const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Add password hashing for security
  role: {
    type: String,
    enum: ['student', 'instructor'],
    required: true,
  },
  
  grades: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    grade: { type: Number, default: 0 },
  }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
