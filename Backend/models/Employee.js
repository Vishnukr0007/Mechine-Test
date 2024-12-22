const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true, // First name is required
  },
  lastName: {
    type: String,
    required: true, // Last name is required
  },
  department: {
    type: String,
    required: true, // Department is required
  },
  designation: {
    type: String,
    required: true, // Designation is required
  },
  dateOfJoining: {
    type: Date,
    required: true, // Joining date is required
  },
  salary: {
    type: Number,
    required: true, // Salary is required
     // Salary cannot be negative
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Email must be unique
    match: [/.+@.+\..+/, 'Please enter a valid email address'], // Validate email format
  },
  profilePic: {
    type: String, // Path to the profile picture
    default: '', // Default to an empty string if no picture is provided
  },
});

module.exports = mongoose.model('Employee', employeeSchema);
