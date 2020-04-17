const Person = require("./Person");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {type: String, required: true, minLength: 4, maxlength: 64,},
    price: {type: Number, minLength: 100, default: 1000},
    imgUrl: {type: String, minLength: 1024,},
    store: {
      name: {type: String, maxLength: 254},
      productUrl: {type: String, maxLength: 1024}
    }
  });
  
  
const Gift = mongoose.model("Gift", schema);

module.exports = Gift;
