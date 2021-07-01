const mongoose = require('mongoose');

const restSchema = new mongoose.Schema({
    name: String,
    rating: String,
    location: String,
    phone: String,
    url: String,
    email: String,
})

const Rest = mongoose.model('Rest', restSchema);

module.exports = Rest;