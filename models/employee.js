// Load mongoose since we need it to define a model
const mongoose = require("mongoose");

// Define the schema
const empSchema = new mongoose.Schema({
  name: { type: String, required: true },
  salary: { type: Number, required: true },
  age: { type: Number, required: true }
});

// Create the model
const Employee = mongoose.model("Employee", empSchema);

// Export the model
module.exports = Employee;
