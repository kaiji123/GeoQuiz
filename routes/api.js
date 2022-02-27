var express = require('express');
var router = express.Router();

const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  // Optional depending on the providers

  apiKey: process.env.API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

//returns an address from given coordinates
router.post('/location', function(req, res, next) {
    //TODO: get address using maps api
    res.send(req.body);
});

router.post('/login', function(req, res, next) {
    user = req.body.username
    res.send("success")
});


module.exports = router;
