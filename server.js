'use strict';
//---------------------UNIVERSAL DEPENDENCIES---------------
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 3001;

//---------------------MONGO Database-----------------------
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to mongo');
});

//---------------------------API Handlers-----------------------
const breweryHandler = require(`./modules/breweryHandler.js`);
const ticketHandler = require(`./modules/ticketHandler.js`);
const restHandler = require(`./modules/restHandler.js`);

//-----------------------------CRUD-----------------------------


app.get('/', (req, res) => {
  res.send('hello');
})
//------------GET FROM APIS
app.get('/breweriesapi', breweryHandler.getBreweries);
app.get('/ticketsapi', ticketHandler.getTickets);
app.get('/restsapi', restHandler.getRests)

//----------RENDER FROM DATABASE
app.get('/breweries', breweryHandler.findBreweryByEmail);
app.get('/tickets', ticketHandler.findTicketByEmail);
app.get('/rests', restHandler.findRestByEmail);

//----------ADD TO DATABASE
app.post('/breweries', breweryHandler.addBrewery);
app.post('/tickets', ticketHandler.addTicket);
app.post('/rests', restHandler.addRest);

//----------DELETE FROM DATABASE
app.delete('/breweries/:id', breweryHandler.deleteBrewery);
app.delete('/tickets/:id', ticketHandler.deleteTicket);
app.delete('/rests/:id', restHandler.deleteRest);

//-------------TOKEN CHECK-----------------
app.get('/test-login', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('invalid token');
    } else {
      res.send(user);
    }
  });
});


//-----------------------------Final Port Check----------------
app.listen(PORT, () => console.log(`listening on ${PORT}`));
