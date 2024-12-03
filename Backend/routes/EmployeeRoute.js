const express = require('express');
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee'); // Assuming you have a model for Employee
const router = express.Router();

// Set up multer storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store uploaded files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// Serve static files from the 'uploads' folder
router.use('/uploads', express.static('uploads'));

// POST route to add a new employee
router.post('/', upload.single('profilePic'), async (req, res) => {
  try {
    const { firstName, lastName, department, designation, dateOfJoining, salary } = req.body;
    const profilePic = req.file.path ? `/uploads/${req.file.filename}` : null; // Store file path
    
    const newEmployee = new Employee({
      firstName,
      lastName,
      department,
      designation,
      dateOfJoining,
      salary,
      profilePic,
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Error adding employee" });
  }
});

// GET route to fetch all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find(); // Assuming you're using MongoDB and Mongoose
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});



// PUT route for updating an employee
router.put('/api/employees/:id', upload.single('profilePic'), async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, department, designation, dateOfJoining, salary } = req.body;
      const profilePic = req.file ? `/uploads/${req.file.filename}` : null;
  
      // Update the employee in the database
      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        {
          firstName,
          lastName,
          department,
          designation,
          dateOfJoining,
          salary,
          profilePic,
        },
        { new: true }
      );
  
      res.json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ message: 'Error updating employee' });
    }
  });
  

module.exports = router;
