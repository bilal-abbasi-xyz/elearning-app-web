const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const Course = require('../models/Course');


exports.addQuizToCourse = async (req, res) => {
  const { courseId, quizData } = req.body;

  try {
    console.log("quiz name:", quizData.name);
    if (!quizData || !quizData.name) {
      return res.status(400).json({ message: 'Quiz name is required' });
    }

    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create a new quiz
    const newQuiz = new Quiz({
      name: quizData.name,
      questions: quizData.questions,
      course: courseId,
    });

    // Save the quiz
    await newQuiz.save();

    // Add the quiz to the course's quizzes list
    course.quizzes.push(newQuiz._id);
    await course.save();

    res.status(201).json({ message: 'Quiz added to course successfully', quizId: newQuiz._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.submitQuiz = async (req, res) => {
  const { studentId, quizId, answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    const student = await User.findById(studentId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found or invalid role' });
    }

    // Calculate score
    let score = 0;
    let totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question, index) => {
      const studentAnswer = answers[index];
      const correctAnswer = question.answers.find(ans => ans.isCorrect);

      if (studentAnswer === correctAnswer.text) {
        score++;
      }
    });

    // Check if the student has already submitted this quiz
    let quizResult = await QuizResult.findOne({ user: studentId, quiz: quizId });

    if (quizResult) {
      // If the quiz result already exists, update it
      quizResult.score = score;
      quizResult.totalQuestions = totalQuestions;
      await quizResult.save();
    } else {
      // If the result doesn't exist, create a new one
      quizResult = new QuizResult({
        user: studentId,
        quiz: quizId,
        score,
        totalQuestions,
      });
      await quizResult.save();
    }
    const course = await Course.findOne({ quizzes: quizId });  // Find the course that contains this quiz

    if (!course) {
      return res.status(404).json({ message: 'Course for this quiz not found' });
    }
    const courseId = course._id; // Now we have the courseId from the Course model

    let studentGradeIndex = student.grades.findIndex(g => g.course && g.course.toString() === courseId.toString());

    if (studentGradeIndex !== -1) {
      // If the grade entry exists, update it
      student.grades[studentGradeIndex].grade = (score / totalQuestions) * 100; // Percentage grade
    } else {
      // If no grade entry for the course, push a new one with the course reference
      student.grades.push({
        course: courseId,  // Include the course reference
        grade: (score / totalQuestions) * 100, // Percentage grade
      });
    }

    await student.save();


    // Optionally, log the updated grades for debugging
    console.log('Updated student grades:', student.grades);

    res.status(200).json({ message: 'Quiz submitted successfully', score });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { name, questions } = req.body;

    // Ensure all required fields are present
    if (!name || !questions) {
      return res.status(400).json({ message: 'Please provide all fields.' });
    }

    // Validate questions and answers structure (additional validation)
    questions.forEach(question => {
      if (!question.questionText || !Array.isArray(question.answers)) {
        return res.status(400).json({ message: 'Each question must have text and answers.' });
      }
      question.answers.forEach(answer => {
        if (typeof answer.text !== 'string' || typeof answer.isCorrect !== 'boolean') {
          return res.status(400).json({ message: 'Answer text must be a string and isCorrect must be a boolean.' });
        }
      });
    });

    // Create the quiz
    const quiz = new Quiz({ name, questions });
    await quiz.save();

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(400).json({ message: 'Error creating quiz', error: error.message || error });
  }

};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching quizzes', error });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching quiz', error });
  }
};

exports.updateQuiz = async (req, res) => {
  const { name, questions } = req.body; // assuming we only want to update name and/or questions

  try {
    // Find the quiz by ID
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Validate if the name is unique (optional, if you want unique names)
    if (name && name !== quiz.name) {
      const existingQuiz = await Quiz.findOne({ name });
      if (existingQuiz) {
        return res.status(400).json({ message: 'Quiz name already exists' });
      }
    }

    // Update the quiz fields
    if (name) quiz.name = name; // Update name if provided
    if (questions) quiz.questions = questions; // Update questions if provided

    await quiz.save(); // Save the updated quiz

    res.status(200).json({
      message: 'Quiz updated successfully',
      quiz,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error updating quiz', error });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting quiz', error });
  }
};
