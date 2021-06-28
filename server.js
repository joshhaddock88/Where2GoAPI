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
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to mongo');
});

//---------------------------API Handlers-----------------------
const breweryHandler = require(`./modules/breweryHandler.js`);
const meetupHandler = require(`./modules/meetupHandler.js`);
const ticketHandler = require(`./modules/ticketHandler.js`);

//-----------------------------CRUD-----------------------------

app.get('/', (req, res) => {
  res.send('hello');
})

//----------RENDER FROM DATABASE
app.get('/breweriesapi', breweryHandler.getBreweries)
app.get('/breweries', breweryHandler.findBreweryByEmail);
// app.get('/meetups', meetupHandler);
// app.get('/tickets', ticketHandler);

//----------ADD TO DATABASE
app.post('/breweries', breweryHandler.addBrewery);


//----------DELETE FROM DATABASE
app.delete('/breweries/:id', breweryHandler.deleteBrewery);

//-------------THIS IS FOR LATER USE-----------------
// app.get('/test-login', (req, res) => {
//   const token = req.headers.authorization.split(' ')[1];
//   jwt.verify(token, getKey, {}, function(err, user) {
//     if(err) {
//       res.status(500).send('invalid token');
//     } else {
//       res.send(user);
//     }
//   });
// });


//-----------------------------Final Port Check----------------
app.listen(PORT, () => console.log(`listening on ${PORT}`));
