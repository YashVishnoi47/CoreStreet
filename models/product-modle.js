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
        default: 0
    },
    price: {
        type: Number,
    },
    bgcolor: String,
    panecolor: String,
    textcolor: String,

});

module.exports = mongoose.model("product", productSchema);