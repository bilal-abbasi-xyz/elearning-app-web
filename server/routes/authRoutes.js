const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authController.loginUser);

router.post('/signup', authController.signUp);

router.get('/current-user', authMiddleware, authController.getCurrentUser);

module.exports = router;
