const axios = require('axios');
const Ticket = require('../models/Ticket.js');

const KEY = process.env.TICKETMASTER_API_KEY

//---------------------JWT THINGS-----------------------------

// const jwt = require('jsonwebtoken');
// const jwksClient = require('jwks-rsa');

// const client = jwksClient({
//   jwksUri: 'https://miriamsilva.us.auth0.com/.well-known/jwks.json'
// });

// //From jwt docs
// function getKey(header, callback){
//   client.getSigningKey(header.kid, function(err, key) {
//     var signingKey = key.publicKey || key.rsaPublicKey;
//     callback(null, signingKey);
//   });
// }

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

//---------------------------EXPORT MODULES
module.exports = {
  getTickets
}