var express = require('express')
var router = express.Router()
var database = require('./database.js')
var quizgen = require('../quiz-generator.js')

const NodeGeocoder = require('node-geocoder')
const res = require('express/lib/response')

//node geocoder configuration
const options = {
    provider: 'google',
    apiKey: 'AIzaSyBsco_UzL1CA7GKB5mXD4_IYuOjTTLY7tQ',
    formatter: null
}

const geocoder = NodeGeocoder(options)

//returns an address from given coordinates
router.post('/location', async (req, res) => {
    var coords = req.body
    locFromCoords(coords).then((loc) => res.send(loc[0]))
})

//checks if users have signed the GDPR
router.post('/get-gdpr', async (req, res) =>{
    let id = req.body.id
    let gdpr = await database.getGDPR(id)
    res.send(gdpr)
})

//sets a user's gdpr status to 1
router.post('/set-gdpr', async (req, res) =>{
    let id = req.body.id
    let status = await database.setGDPR(id, 1)
    res.sendStatus(status)

})

//adds a user to the database
router.post('/add-user', function (req, res) {
    id = req.body.id
    usernname = req.body.name
    res.send(database.addUser(id, usernname))
})

router.delete('/users', function(req, res){
  data = req.body
  let userId = data.id
  res.send(database.deleteUser(userId))
})


router.get('/scores', async (req, res) => {
    let scores = await database.getScores()
    res.send(scores)
})

router.get('/leaderboard', async (req, res) => {
    let leaderboard = await database.getLeaderboard()
    res.send(leaderboard)
   
})

//save a user's score to the database
router.post('/save-score', (req, res) => {
    let data = req.body
    let score = data.score
    let googleId = data.id
    let percentage = data.percentage

    database.addScore(googleId, score, percentage).then((status) =>{
        res.sendStatus(status)
    })
})

//will return a quiz when passed a location
router.post('/quiz', async (req, res) => {
    var coords = req.body

    quizgen.generateQuizCache().then((data) => {
        res.send(data)
    })
})

//uses node geocoder to return location data from a set of coords
locFromCoords = (coords) => {
    return new Promise((resolve, reject) => {
        geocoder.reverse(coords).then((loc) => resolve(loc))
    })
}


module.exports = router
