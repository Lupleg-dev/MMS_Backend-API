const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    token : {
        type: String,
        default: ''
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    about: {
        type: String,
    },
    website: {
        type: String,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    }
},{timestamps : true});

const programSchema = new mongoose.Schema({
    percentage: {
      type: Number,
      required: true,
    },
  });
  
  // Example Schema for Reports
  const reportSchema = new mongoose.Schema({
    heading: {
      type: String,
      required: true,
    },
    icon: {
      type: String, // You might want to store the icon path or any identifier
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  });
  
  // Example Schema for Tasks
  const taskSchema = new mongoose.Schema({
    icon: {
      type: String, // You might want to store the icon path or any identifier
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    days: {
      type: String,
      required: true,
    },
  });
  
  const Program = mongoose.model("Program", programSchema);
  const Report = mongoose.model("Report", reportSchema);
  const Task = mongoose.model("Task", taskSchema);
  
  module.exports = { Program, Report, Task };

module.exports = mongoose.model("User",UserSchema);