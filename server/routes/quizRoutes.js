const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// POST: Create a new quiz
router.post('/quizzes', quizController.createQuiz);

router.post('/add-quiz-to-course', quizController.addQuizToCourse);

// GET: Fetch all quizzes
router.get('/quizzes', quizController.getAllQuizzes);

router.post('/submit-quiz', quizController.submitQuiz);

// GET: Fetch a quiz by ID
router.get('/quizzes/:id', quizController.getQuizById);

// PUT: Update a quiz by ID
router.put('/quizzes/:id', quizController.updateQuiz);

// DELETE: Delete a quiz by ID
router.delete('/quizzes/:id', quizController.deleteQuiz);

module.exports = router;
