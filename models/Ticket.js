const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    name: String,
    venue: String,
    startDate: String,
    startTime: String,
    url: String,
    email: String,
})

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
