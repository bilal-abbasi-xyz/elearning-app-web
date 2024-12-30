const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');

// POST: Create a new lecture
router.post('/lectures', lectureController.createLecture);

// GET: Fetch all lectures
router.get('/lectures', lectureController.getLectures);

// GET: Fetch a lecture by ID
router.get('/lectures/:id', lectureController.getLectureById);

// PUT: Update a lecture by ID
router.put('/lectures/:id', lectureController.updateLecture);

// DELETE: Delete a lecture by ID
router.delete('/lectures/:id', lectureController.deleteLecture);

module.exports = router;
