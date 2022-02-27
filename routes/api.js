var express = require('express');
var router = express.Router();

const { Navigator } = require("node-navigator");
const NodeGeocoder = require('node-geocoder');
const navigator = new Navigator();

const options = {
  provider: 'google',
  // Optional depending on the providers

  apiKey: process.env.API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

//get client location
router.get('/location', function(req, res, next) {

});

router.post('/login', function(req, res, next) {
    user = req.body.username
    res.send("success")
  });
