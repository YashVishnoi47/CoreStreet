const mongoose = require("mongoose");


const ownerSchema = mongoose.Schema({
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
    required: true,
  },
  picture: {
    type: String,
  },
  products: {
    type: Array,
    default: [],
  },
  role: {
    type: String,
    enum: ['admin', 'owner'],
    default: 'owner',
  },
  gstin: String,
});

module.exports = mongoose.model("owner", ownerSchema);
