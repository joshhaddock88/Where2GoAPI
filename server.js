'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 3001;

//--------------------JWT Web Tokens------------------------

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://miriamsilva.us.auth0.com/.well-known/jwks.json'
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

//---------------------Database Stuff-----------------------
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to mongo');
});

//-----------------------------CRUD-----------------------------

app.get('/', (req, res) => {
  res.send('hello');
})

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
