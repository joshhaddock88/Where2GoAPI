const mongoose = require('mongoose');

const brewerySchema = new mongoose.Schema({
    name: String,
    street: String,
    phone: String
})

const Ticket = mongoose.model('Ticket', brewerySchema);

module.exports = Ticket;