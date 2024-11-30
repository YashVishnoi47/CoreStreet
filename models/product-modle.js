const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: Buffer,
  },
  discount: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "owner",
    required: true,
  },
  reviews:{
    type:Array,
    default:[],
  },
  bgcolor: String,
  panecolor: String,
  textcolor: String,
});

module.exports = mongoose.model("product", productSchema);
