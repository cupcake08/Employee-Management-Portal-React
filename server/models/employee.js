const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  idTemp:{
    type:Number,
    required:true
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  salary: {
    type: Number,
    required: [true, "Salary is required"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Gender is required"],
  },
  team: {
    type: String,
    enum: ["alpha", "beta", "gamma"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
});
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
