const Student = require("./Student");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    code: String,
    title: String,
    description: String,
    url: String,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }]
  });
  
  
const Course = mongoose.model("Course", schema);

module.exports = Course;
