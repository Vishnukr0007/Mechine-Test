const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;
const EmployeeRoute = require('./routes/EmployeeRoute');  // Ensure this file exists

// Middleware
app.use(express.json()); // Built-in middleware for JSON parsing
app.use(express.urlencoded({ extended: true })); // URL encoding with extended true
app.use(cors());

// Use routes
app.use('/api/employees', EmployeeRoute);  // Mount the employee route with the correct path

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/MTEST', {
    // Ensure connection is stable
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
