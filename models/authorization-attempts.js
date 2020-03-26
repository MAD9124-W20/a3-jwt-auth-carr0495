const mongoose = require('mongoose')
const User = require("./User");


const schema = new mongoose.Schema({
  username: { type: String, trim: true, maxlength: 64, required: true },
  ipAddress: { type: String, trim: true, maxlength: 64, required: true },
  didSucceed: {type: Boolean, required: true},
  createdAt: {type: Date,required: true}
})

const Model = mongoose.model('authorization-attempts', schema)

module.exports = Model;