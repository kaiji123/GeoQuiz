var express = require('express');
const { Navigator } = require("node-navigator");
const NodeGeocoder = require('node-geocoder');
const navigator = new Navigator();
var router = express.Router();


var user =""

const options = {
  provider: 'google',
  // Optional depending on the providers

  apiKey: process.env.API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);






router.get('/', function(req, res, next) {
  
 
  navigator.geolocation.getCurrentPosition((success, error) => {
    if (error) console.error(error);
    else console.log(success);
    async function getResponse() {
      const response = await geocoder.reverse({ lat: success.latitude, lon: success.longitude });
      res.render('index', { title: 'GeoQuiz', location:response[0].city, username: user });
    }
    
    getResponse()
  });
});

router.post('/', function(req, res, next) {
  user  = req.body.username
  res.send("success")
});










module.exports = router;
