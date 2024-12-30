const Lecture = require('../models/Lecture');
console.log("Lecture is ", Lecture);
// POST: Create a new lecture
exports.createLecture = async (req, res) => {
  const { name, content } = req.body;

  try {
    const lecture = new Lecture({ name, content });
    await lecture.save();
    res.status(201).json({
      message: 'Lecture created successfully',
      lecture,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating lecture', error });
  }
};

// GET: Fetch all lectures
exports.getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find();
    res.status(200).json(lectures);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching lectures', error });
  }
};

// GET: Fetch a single lecture by ID
exports.getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.status(200).json(lecture);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching lecture', error });
  }
};

// PUT: Update a lecture by ID
exports.updateLecture = async (req, res) => {
  const { name, content } = req.body;
  try {
    const lecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      { name, content },
      { new: true }
    );
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.status(200).json({
      message: 'Lecture updated successfully',
      lecture,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating lecture', error });
  }
};

// DELETE: Delete a lecture by ID
exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.status(200).json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting lecture', error });
  }
};
