const mongoose = require('mongoose');

const brewerySchema = new mongoose.Schema({
    name: String,
    website_url: String,
    street: String,
    phone: String
})

const Brewery = mongoose.model('Brewery', brewerySchema);

module.exports = Brewery;
