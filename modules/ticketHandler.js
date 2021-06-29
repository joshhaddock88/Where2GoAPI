const axios = require('axios');
const Ticket = require('../models/Ticket.js');

const KEY = process.env.TICKETMASTER_API_KEY

//---------------------JWT THINGS-----------------------------

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://miriamsilva.us.auth0.com/.well-known/jwks.json'
});

//From jwt docs
function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

//---------------------------API Contact------------------------
class Tickets{
  constructor(ticketObject){
    this.name = ticketObject.name;
    this.venue = ticketObject._embedded.venues[0].name;
    this.startDate = ticketObject.dates.start.localDate;
    this.startTime = ticketObject.dates.start.localTime;
    
  }
}

getTickets = async (req, res) => {
  const city = req.query.city
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&apikey=${KEY}`;
  console.log(url);

  try{
    const ticketList = await axios.get(url);
    const ticketArr = ticketList.data._embedded.events.map(ticket => new Tickets(ticket));
    res.send(ticketArr);
  } catch{
    res.status(500).send('No ticket data found');
  }
}

//---------------------CRUD------------------------------------
// FIND TICKETS BY EMAIL
let findTicketByEmail = (req,res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('Invalid token');
    } else {
      let userEmail = user.email;
      Ticket.find({email: userEmail}, (err, tickets) => {
        console.log(tickets);
        res.send(tickets);
      });
    }
  });
};

//ADD TICKET
let addTicket = (req, res) => {
  console.log('Tickets! Yay!');
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('Invalid token');
    } else {
      const newTicket = new Ticket ({
        name: req.body.name,
        venue: req.body.venue,
        startDate: req.body.startDate,
        startTime: req.body.startTime
      });
      newTicket.save((err, savedTicketData) => {
        res.send(savedTicketData);
      });
    }
  });
};

//DELETE TICKET
let deleteTicket = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('invalid token');
    } else {
      let ticketId = req.params.id;
      console.log(ticketId);

      Ticket.deleteOne({_id: ticketId, email: user.email})
        .then(deletedTicketData => {
          console.log(deletedTicketData);
          res.send('Successfully deleted Ticket');
        });
    }
  });
}

//---------------------------EXPORT MODULES
module.exports = {
  getTickets, findTicketByEmail, addTicket, deleteTicket
}