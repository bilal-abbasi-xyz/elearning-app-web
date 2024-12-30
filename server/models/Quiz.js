// quiz.js
const mongoose = require('mongoose');

// Answer schema for each possible answer in a question
const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  }
});

// Question schema, which includes multiple answers
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  answers: [answerSchema], // Array of possible answers for the question
});

// Quiz schema, which includes an array of questions
const quizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure each quiz has a unique name
  },
  questions: [questionSchema], // Array of questions in the quiz
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

// Ensure that Quiz is properly exported
module.exports = Quiz;
