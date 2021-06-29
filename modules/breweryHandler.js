const axios = require('axios');
const Brewery = require('../models/Brewery.js');

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
class Breweries {
  constructor(breweryObject) {
    this.name = breweryObject.name;
    this.street = breweryObject.street;
    this.website_url = breweryObject.website_url;
    this.phone = breweryObject.phone;
  };
};

getBreweries = async (req, res) => {
  const city = req.query.city;
  const url = `https://api.openbrewerydb.org/breweries?per_page=50&by_city=${city}`;

  try {
    const breweryList = await axios.get(url);
    const breweryArr = breweryList.data.map(brewery => new Breweries(brewery));
    res.send(breweryArr);
  } catch {
    res.status(500).send('No brewery data found');
  }
}

//---------------------CRUD------------------------------------
// FIND BREWERY BY EMAIL
let findBreweryByEmail = (req,res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('Invalid token');
    } else {
      let userEmail = user.email;
      Brewery.find({email: userEmail}, (err, breweries) => {
        console.log(breweries);
        res.send(breweries);
      });
    }
  });
};

// ADD BREWERY
let addBrewery = (req, res) => {
  console.log('Breweries! Yay!');
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('Invalid token');
    } else {
      const newBrewery = new Brewery ({
        name: req.body.name,
        street: req.body.street,
        website_url: req.body.website_url,
        phone: req.body.phone
      });
      newBrewery.save((err, savedBreweryData) => {
        res.send(savedBreweryData);
      });
    }
  });
};

// DELETE BREWERY
let deleteBrewery = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('invalid token');
    } else {
      let breweryId = req.params.id;
      console.log(breweryId);

      Brewery.deleteOne({_id: ticketId, email: user.email})
        .then(deletedBreweryData => {
          console.log(deletedBreweryData);
          res.send('Successfully deleted Brewery');
        });
    }
  });
}

//-----------------------EXPORT MODULES
module.exports = {
  getBreweries, findBreweryByEmail, addBrewery, deleteBrewery
}