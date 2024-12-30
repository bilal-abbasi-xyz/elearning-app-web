const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Lecture = require('../models/Lecture');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  const { name, quizzes, lectures, instructorId } = req.body;

  if (!instructorId) {
    return res.status(400).json({ message: 'Instructor ID is required' });
  }

  try {
    // Validate that the instructor exists and is an instructor
    const instructor = await User.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    if (instructor.role !== 'instructor') {
      return res.status(403).json({ message: 'User is not an instructor' });
    }

    // Create a new course
    const course = new Course({
      name,
      quizzes,
      lectures,
      instructor: instructorId,
    });

    await course.save();
    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating course', error });
  }
};

exports.enrollStudentInCourse = async (req, res) => {
  const { studentId, courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found or invalid role' });
    }

    // Add the course to the student's grades
    student.grades.push({ course: courseId, grade: 0 });  // Initially set grade to 0
    await student.save();

    res.status(200).json({ message: 'Student enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET: Fetch all courses along with their quizzes and lectures
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('quizzes')  // Populate the quizzes field with Quiz details
      .populate('lectures');  // Populate the lectures field with Lecture details
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching courses', error });
  }
};

// GET: Fetch a single course by ID with its quizzes and lectures
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('quizzes')  // Populate quizzes for the specific course
      .populate('lectures');  // Populate lectures for the specific course

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching course', error });
  }
};

// PUT: Update a course by ID with new quizzes and lectures
exports.updateCourse = async (req, res) => {
  const { name, quizzes, lectures } = req.body;

  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, quizzes, lectures },
      { new: true }
    ).populate('quizzes')  // Populate quizzes after update
      .populate('lectures');  // Populate lectures after update

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating course', error });
  }
};

// DELETE: Delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting course', error });
  }
};
