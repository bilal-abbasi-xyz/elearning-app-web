const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// POST: Create a new course
router.post('/courses', courseController.createCourse);

// GET: Fetch all courses
router.get('/courses', courseController.getAllCourses);

// GET: Fetch a single course by ID
router.get('/courses/:id', courseController.getCourseById);

// PUT: Update a course by ID
router.put('/courses/:id', courseController.updateCourse);

// DELETE: Delete a course by ID
router.delete('/courses/:id', courseController.deleteCourse);

module.exports = router;
