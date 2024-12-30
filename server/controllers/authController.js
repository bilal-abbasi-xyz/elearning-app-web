const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

// Use a more secure JWT secret stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable for security

// Login logic
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide both username and password.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Compare the provided password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.json({ token }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Signup logic
exports.signUp = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Check if role is provided, if not, default to 'student'
        const userRole = role && role === 'instructor' ? 'instructor' : 'student';

        // Hash the password before saving to DB
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: userRole,
        });

        // Only allow admin to create instructor accounts
        if (userRole === 'instructor' && req.user && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can create instructors.' });
        }

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
      // Get the user from the request object set by the middleware
      const user = await User.findById(req.user.id).populate('grades.course'); // Populate the course details for each grade
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Return user info along with grades
      res.status(200).json({
        username: user.username,
        email: user.email,
        role: user.role,
        grades: user.grades,  // Include the grades in the response
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  