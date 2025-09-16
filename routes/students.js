const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const student = new Student({ name, email });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/assign-to-mentor', async (req, res) => {
  try {
    const { mentorId, studentIds } = req.body;
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });

    const updated = [];
    for (let id of studentIds) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const student = await Student.findById(id);
        if (student && !student.currentMentor) {
          student.currentMentor = mentorId;
          await student.save();
          updated.push(student);
        }
      }
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:studentId/assign-mentor', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { mentorId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    if (student.currentMentor) {
      student.previousMentors.push({ mentor: student.currentMentor, assignedAt: new Date() });
    }
    student.currentMentor = mentorId;
    await student.save();

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:studentId/previous-mentors', async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate('previousMentors.mentor', 'name email');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student.previousMentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/unassigned', async (req, res) => {
  try {
    const students = await Student.find({ currentMentor: null });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
