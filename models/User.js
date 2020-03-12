const bcrypt = require('bcrypt')
const saltRounds = 14
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require("dotenv").config();

const schema = new mongoose.Schema({
  firstName: { type: String, trim: true, maxlength: 64, required: true },
  lastName: { type: String, trim: true, maxlength: 64 },
  email: {
    type: String,
    trim: true,
    maxlength: 512,
    required: true,
    unique: true
  },
  password: { type: String, trim: true, maxlength: 60, required: true }
})

schema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.TOKENKEY)
}

schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email: email })
  const hashedPassword = user
    ? user.password
    : `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
  const passwordDidMatch = await bcrypt.compare(password, hashedPassword)

  return passwordDidMatch ? user : null
}

schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = await bcrypt.hash(this.password, saltRounds)
  next()
})

schema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const Model = mongoose.model('User', schema)

module.exports = Model