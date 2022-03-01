var express = require('express');
var router = express.Router();
var database = require("./database.js")

const NodeGeocoder = require('node-geocoder');
const res = require('express/lib/response');

const options = {
  provider: 'google',
  // Optional depending on the providers

  apiKey: 'AIzaSyBsco_UzL1CA7GKB5mXD4_IYuOjTTLY7tQ', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

//returns an address from given coordinates
router.post('/location', async (req, res) => {
    var coords = req.body;
    var location = await locFromCoords(coords);
    console.log(location);
    res.send(location[0]);

});

//select a user id from the database and return it
router.get('/selectuid', function(req, res){
  res.send(database.selectUID());
});

async function locFromCoords(coords){
  const loc = await geocoder.reverse(coords);
  return loc;
}

router.post('/login', function(req, res, next) {
    user = req.body.username
    res.send("success")
});


module.exports = router;
