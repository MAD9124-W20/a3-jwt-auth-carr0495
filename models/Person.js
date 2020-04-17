const mongoose = require("mongoose");
const Gift = require('./Gift');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

const schema = new mongoose.Schema({
  name: {type: String, required: (true,'Name required (error)'), maxLength: 254 },
  birthday: {type: Date, required: (true,'Birthdate required (error)')},
  owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", maxLength: 64},
  sharedWith: [{type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  gifts: {type: Array, ref: "Gift"},
  imgUrl: {type: String, maxLength: 1024},

},{timestamps:true});

schema.plugin(uniqueValidator, {
  message: props =>
    props.path === 'email' ?
    `The email address '${props.value}' is already registered.` :
    `The ${props.path} must be unique. '${props.value}' is already in use.`
});

const Model = mongoose.model("Person", schema);

module.exports = Model;