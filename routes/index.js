var express = require('express');
var router = express.Router();

var user = "";

router.get('/', function(req, res, next) {
  res.render('index', { title: 'GeoQuiz'});
});

module.exports = router;
