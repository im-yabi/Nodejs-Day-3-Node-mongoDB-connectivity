const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  currentMentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', default: null },
  previousMentors: [{
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
    assignedAt: { type: Date }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
