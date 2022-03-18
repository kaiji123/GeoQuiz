var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/quiz', function(req, res, next) {
  res.render('quiz');
});

router.get('/score', function(req, res, nect){
  res.render('score')
});

router.get('/terms-of-use', function(req, res, nect){
  res.render('terms-of-use')
});

router.get('/support', function(req, res, nect){
  res.render('support')
});

router.get('/about', function(req, res, nect){
  res.render('about')
});


module.exports = router;
