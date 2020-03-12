const mongoose = require("mongoose");
const Course = require('./Course');

const schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  nickName: String,
  email: String
});
const Model = mongoose.model("Student", schema);

module.exports = Model;
