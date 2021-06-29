const mongoose = require('mongoose');

const brewerySchema = new mongoose.Schema({
    name: String,
    venue: String,
    startDate: String,
    startTime: String,
})

const Ticket = mongoose.model('Ticket', brewerySchema);

module.exports = Ticket;