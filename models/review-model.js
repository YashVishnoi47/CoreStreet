const mongoose = require('mongoose');


const reviewModel = mongoose.Schema({
    comment:[{
        type: String,
        required: true
    }],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }
})

module.exports = mongoose.model('review', reviewModel);