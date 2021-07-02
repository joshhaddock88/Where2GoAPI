const axios = require ('axios');
const Rest = require ('../models/Restaurant.js');

const KEY = process.env.YELP_API_KEY;

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
class Rests {
  constructor (restObject) {
    this.name = restObject.name;
    this.rating = restObject.rating;
    this.location = restObject.location.display_address.join(", ");
    this.phone = restObject.display_phone;
    this.url = restObject.url;
  }
}

getRests = async (req, res) => {
  const city = req.query.location;
  const url = `https://api.yelp.com/v3/businesses/search?location=${city}`;
  console.log(url);

  try {
    const restList = await axios.get (url, {
      headers: {
        Authorization: `Bearer ${KEY}`,
      },
    });
    const restArr = restList.data.businesses.map (rest => new Rests (rest));
    res.send (restArr);
  } catch (err) {
    console.log (err);
    res.status (500).send ('No restaurant data found');
  }
};

//---------------------CRUD------------------------------------
// FIND TICKETS BY EMAIL
let findRestByEmail = (req,res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('Invalid token');
    } else {
      let userEmail = user.email;
      Rest.find({email: userEmail}, (err, rests) => {
        console.log(rests);
        res.send(rests);
      });
    }
  });
};

//ADD RESTAURANT
let addRest = (req, res) => {
  console.log('Restaurants! Yay!');
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('Invalid token');
    } else {
      const newRest = new Rest ({
        name: req.body.name,
        rating: req.body.rating,
        location: req.body.location,
        phone: req.body.phone,
        url: req.body.url,
        email: user.email
      });
      newRest.save((err, savedRestData) => {
        if(err){
          console.log(err)
        }
        res.send(savedRestData);
        console.log(savedRestData);
      });
    }
  });
};

//DELETE RESTAURANT
let deleteRest = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('invalid token');
    } else {
      let restId = req.params.id;
      console.log(restId);

      Rest.deleteOne({_id: restId, email: user.email})
        .then(deletedRestData => {
          console.log(deletedRestData);
          res.send('Successfully deleted Restaurant');
        });
    }
  });
}

module.exports = {
  getRests, findRestByEmail, deleteRest, addRest
};
