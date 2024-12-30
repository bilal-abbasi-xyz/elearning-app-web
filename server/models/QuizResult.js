const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
}, { timestamps: true,
    collection: 'quizResults'  // Explicitly set the collection name to 'quizResults'
 });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;
