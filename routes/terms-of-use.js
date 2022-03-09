var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('terms-of-use', { title: 'GeoQuiz'});
});

module.exports = router;