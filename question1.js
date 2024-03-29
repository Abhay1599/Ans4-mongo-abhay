// Load required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const database = require("./config/database");
const Employee = require("./models/employee");

// Initialize express app
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(database.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("MongoDB connection error:", error));

// Define routes

// Get all employees
app.get("/api/employees", (req, res) => {
  Employee.find()
    .then(employees => res.json(employees))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Get an employee by ID
app.get("/api/employees/:employee_id", (req, res) => {
  const id = req.params.employee_id;
  Employee.findById(id)
    .then(employee => {
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// Create a new employee
app.post("/api/employees", (req, res) => {
  const { name, salary, age } = req.body;
  Employee.create({ name, salary, age })
    .then(employee => res.status(201).json(employee))
    .catch(error => res.status(400).json({ error: error.message }));
});

// Update an existing employee
app.put("/api/employees/:employee_id", (req, res) => {
  const id = req.params.employee_id;
  const { name, salary, age } = req.body;
  Employee.findByIdAndUpdate(id, { name, salary, age }, { new: true })
    .then(employee => {
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    })
    .catch(error => res.status(400).json({ error: error.message }));
});

// Delete an employee by ID
app.delete("/api/employees/:employee_id", (req, res) => {
  const id = req.params.employee_id;
  Employee.findByIdAndDelete(id)
    .then((employee) => {
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json({ message: "Employee deleted successfully" });
    })
    .catch((error) => res.status(500).json({ error: error.message }));
});


// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
