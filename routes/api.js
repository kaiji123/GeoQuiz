var express = require('express');
var router = express.Router();
var database = require('./database.js');
var quizgen = require('../quiz-generator.js')

const NodeGeocoder = require('node-geocoder');
const res = require('express/lib/response');

//node geocoder configuration
const options = {
  provider: 'google',
  apiKey: 'AIzaSyBsco_UzL1CA7GKB5mXD4_IYuOjTTLY7tQ', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

//returns an address from given coordinates
router.post('/location', async (req, res) => {
    var coords = req.body;
    var location = await locFromCoords(coords);
    //console.log(location);
    res.send(location[0]);
});

//select a user id from the database and return it
router.get('/selectuid', function(req, res){
  res.send(database.selectUID());
});

//uses node geocoder to return location data from a set of coords
async function locFromCoords(coords){
  const loc = await geocoder.reverse(coords);
  return loc;
}

//will generate a quiz given a location
router.post('/quiz', async(req, res) =>{  
  //send the client coordinates to the quiz generator
  var coords = req.body;
  
  quizgen.generateQuiz(coords).then(data => {
    console.log(data);
    //send back the quiz JSON
    res.send(data);  
  });
});

module.exports = router;
