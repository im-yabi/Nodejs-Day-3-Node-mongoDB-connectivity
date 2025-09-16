const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const mongoose = require('mongoose');


router.post('/', async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const mentor = new Mentor({ name, email, department });
    await mentor.save();
    res.status(201).json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:mentorId/students', async (req, res) => {
  try {
    const { mentorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(mentorId)) return res.status(400).json({ error: 'Invalid mentorId' });
    const students = await Student.find({ currentMentor: mentorId });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
