var express = require('express');
var router = express.Router();
var database = require('./database.js');
var quizgen = require('../quiz-generator.js')

const NodeGeocoder = require('node-geocoder');
const res = require('express/lib/response');
const { json } = require('express/lib/response');

//node geocoder configuration
const options = {
    provider: 'google',
    //apiKey: 'AIzaSyChzAGrXXV8gklFuucKcuT_dY0lOg5Fd84',
    apiKey: 'AIzaSyBsco_UzL1CA7GKB5mXD4_IYuOjTTLY7tQ', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

//returns an address from given coordinates
router.post('/location', async (req, res) => {
    var coords = req.body;
    locFromCoords(coords).then((loc) => res.send(loc[0]));
});

//add a user to the database
router.get('/adduser', function (req, res) {
    //we might need to change the /adduser to /user and use post method for api convention
    res.send(database.addUser(1, 'laila'));
});


router.post('/users', function (req, res) {
    id = req.body.id
    usernname = req.body.name
    res.send(database.addUser(id, usernname))
})

router.get('/users', function (req, res) {
    res.send(database.getUsers());
})


router.get('/top5', database.getTop5
)

router.get('/leaderboard', database.getLeaderboard
)


router.post('/save-score', (req, res) => {
    let data = req.body
    let score = data.score
    let googleId = data.id
    let percentage = data.percentage
    console.log(score)
    res.send(database.addScore(googleId, score, percentage))
})

//uses node geocoder to return location data from a set of coords
const locFromCoords = (coords) => {
    return new Promise((resolve, reject) => {
        geocoder.reverse(coords).then((loc) => resolve(loc))
    })
}

//will return a quiz when passed a location
router.post('/quiz', async (req, res) => {

    var coords = req.body;

    //quizgen.generateQuiz(coords).then((data) => {
    //  res.send(data)
    //});

    quizgen.generateQuizCache().then((data) => {
        res.send(data)
    });
});

module.exports = router;
