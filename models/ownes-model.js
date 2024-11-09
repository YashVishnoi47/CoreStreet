const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
  },
  picture: {
    type: String,
  },
  products: {
    type: Array,
    default: [],
  },
  gstin: String,
});

module.exports = mongoose.model("user", userSchema);
