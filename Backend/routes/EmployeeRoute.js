const express = require('express');
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee'); // Replace with the correct path to your Employee model

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // create a unique filename
  },
});

// Initialize Multer
const upload = multer({ storage: storage });

// Serve static files from the 'uploads' folder
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// POST route to add new employee (with image upload)
router.post('/api/employees', upload.single('profilePic'), async (req, res) => {
  try {
    // Create a new employee
    const newEmployee = new Employee({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      department: req.body.department,
      designation: req.body.designation,
      dateOfJoining: req.body.dateOfJoining,
      salary: req.body.salary,
      email: req.body.email,
      profilePic: req.file ? `/uploads/${req.file.filename}` : '', // Save the file path
    });

    // Save the employee to the database
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee); // Return the saved employee
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error saving employee' });
  }
});

// PUT route to update employee (with image upload)
// API route for updating an employee
router.put('/api/employees/:id', upload.single('profilePic'), async (req, res) => {
    try {
      const updates = { ...req.body };
  
      // If a file was uploaded, update the profilePic field
      if (req.file) {
        updates.profilePic = `/uploads/${req.file.filename}`;
      }
  
      // Find the employee by ID and update their details
      const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true });
  
      if (!updatedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      // Respond with the updated employee data
      res.status(200).json(updatedEmployee);
    } catch (err) {
      console.error('Error updating employee:', err);
      res.status(400).json({ message: 'Error updating employee' });
    }
  });
  
  

// GET route to fetch all employees (with full image URL)
router.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();

    // Ensure the profilePic field returns a full URL if it's an image
    const updatedEmployees = employees.map((employee) => {
      if (employee.profilePic) {
        // Make the profilePic URL absolute
        employee.profilePic = `${req.protocol}://${req.get('host')}${employee.profilePic}`;
      }
      return employee;
    });

    res.status(200).json(updatedEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});
router.delete('/api/employees/:id', async (req, res) => {
    try {
      // Get employee ID from the request parameters
      const { id } = req.params;
  
      // Check if the employee exists
      const employee = await Employee.findById(id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      // Delete the employee
      await Employee.findByIdAndDelete(id);
  
      // Respond with success
      res.status(200).json({ message: 'Employee deleted successfully!' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Failed to delete employee. Please try again.' });
    }
  });

module.exports = router;
