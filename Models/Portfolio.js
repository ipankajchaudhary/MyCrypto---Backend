const mongoose = require('mongoose');
const { Schema } = mongoose;

const PortfolioSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    coinid: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('portfolio', PortfolioSchema)