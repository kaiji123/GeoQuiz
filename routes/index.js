var express = require('express');
const { Navigator } = require("node-navigator");
const navigator = new Navigator();
var router = express.Router();





function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition((success, error) => {
  if (error) console.error(error);
  else console.log(success);

  
});



router.get('/', function(req, res, next) {
  res.render('index', { title: 'GeoQuiz', location: "Birmingham" });
});

module.exports = router;
