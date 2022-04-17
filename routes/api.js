var express = require('express')
var router = express.Router()
var database = require('./database.js')
var quizgen = require('./quiz-gen-v2.js')
var profilePicture = require('./profile-picture.js')
var jwt = require('jsonwebtoken')

var fs = require('fs').promises

const NodeGeocoder = require('node-geocoder')

//node geocoder configuration
const options = {
    provider: 'google',
    apiKey: process.env.GEOCODE_KEY,
    formatter: null
}

const geocoder = NodeGeocoder(options)



/**
 * @swagger
 * /get-gdpr:
 *    post:
 *      description: Use to check if users have signed the GDPR
 *      responses:
 *        '200':
 *         description: Successfully signed GDPR
 */
//checks if users have signed the GDPR
router.post('/get-gdpr', async (req, res) => {
    let id = req.body.id
    let gdpr = await database.getGDPR(id)
    res.send(gdpr)
})

/**
 * @swagger
 * /set-gdpr:
 *    post:
 *      description: Use to set user's GDPR status to 1
 *      responses:
 *        '200':
 *         description: Successfully set GDPR status to 1
 */
//sets a user's gdpr status to 1
router.post('/set-gdpr', async (req, res) => {
    let id = req.body.id
    let status = await database.setGDPR(id, 1)
    res.sendStatus(status)

})




/**
 * @swagger
 * /add-user:
 *    post:
 *      description: Use to add a user to the database if they don't already exist
 *      responses:
 *        '200':
 *         description: Successfully checked user credentials
 */
//adds a user to the database if they don't already exist
router.post('/add-user', async (req, res) => {
    let id = req.body.id
    let name = req.body.name

    let exists = await database.userExists(id)

    console.log(exists)

    if (!exists) {
        var status = await database.addUser(id, name)

        let user = { username: name, googleId: id }
        const token = jwt.sign(user, process.env.JWT_KEY)
        res.json(token)
    }
    else {
        // check the user with correct credentials exists
        let check = await database.userExist2(id, name);
        let user = { username: name, googleId: id }

        //if correct send success status
        if (check) {

            //jwt authentication
            console.log("user exists")
            const token = jwt.sign(user, process.env.JWT_KEY)


            //send token response
            res.json(token)

        } else {
            console.log("bad user")
            res.sendStatus(403)
        }

    }
})

/**
 * @swagger
 * /profile-picture:
 *    get:
 *      description: Use to fetch a profile picture
 *      responses:
 *        '200':
 *         description: Successfully fetched profile picture
 */
router.get('/profile-picture/:id', async (req, res) => {
    let id = req.params.id
    console.log('fetching profile picture for ' + id)
    let pixels = await database.getProfilePicture(id)

    //turn our json into an image
    let data = profilePicture.renderProfilePicture(JSON.parse(pixels), 500)
    res.setHeader('content-type', 'image/png');
    res.send(data)
})

/**
 * @swagger
 * /reset-pfp:
 *    post:
 *      description: Use to reset a user's profile picture
 *      responses:
 *        '200':
 *         description: Successfully reset profile picture
 */
router.post('/reset-pfp', async (req, res) => {
    let id = req.body.id
    let pfp = JSON.stringify(profilePicture.generateProfilePicture())

    let status = await database.setProfilePicture(id, pfp)
    res.sendStatus(status)
})


/**
 * @swagger
 * /users:
 *    delete:
 *      description: Use to delete user account 
 *      requestBody:
 *          required: true
 *      responses:
 *          '200':
 *              description: Successfully deleted user
 */
router.delete('/users', authenticateToken, function (req, res) {

    data = req.body
    let userId = data.id



    // add a layer of security

    //to do cascading delete
    let datares = database.deleteUser(userId)


    res.sendStatus(200)
    
})

/**
 * @swagger
 * /scores:
 *    get:
 *      description: Use to fetch scores
 *      responses:
 *        '200':
 *         description: Successfully fetched scores
 */
router.get('/scores', async (req, res) => {
    let scores = await database.getScores()
    res.send(scores)
})

/**
 * @swagger
 * /leaderboard:
 *    get:
 *      description: Use to fetch the leaderboard
 *      responses:
 *        '200':
 *         description: Successfully fetched leaderboard
 */
router.get('/leaderboard', async (req, res) => {
    let leaderboard = await database.getLeaderboard()
    res.send(leaderboard)

})

/**
 * @swagger
 * /save-score:
 *    post:
 *      description: Use to add a user's score to the database
 *      responses:
 *        '200':
 *         description: Successfully saved score
 */
//save a user's score to the database
router.post('/save-score', (req, res) => {
    let data = req.body
    let score = data.score
    let googleId = data.id
    let percentage = data.percentage

    database.addScore(googleId, score, percentage).then((status) => {
        res.sendStatus(status)
    })
})

/**
 * @swagger
 * /support:
 *    post:
 *      description: Use to receive and handle support queries
 *      responses:
 *        '200':
 *         description: Successfully received support query
 */
//receieve and handle support queries
router.post('/support', async (req, res) => {
    json = req.body
    fs.readFile('./support/requests.json')
        .then((raw) => {
            data = JSON.parse(raw)
            data.push(json)
            return fs.writeFile('./support/requests.json', JSON.stringify(data))
        })
        .then(() => {
            res.send(req.body)
        })
        .catch((err) => {
            console.log(err)
        })
})

/**
 * @swagger
 * /quiz:
 *    post:
 *      description: Use to generate a quiz
 *      responses:
 *        '200':
 *         description: Successfully generated a quiz
 */
//will return a quiz when passed a location
router.post('/quiz', async (req, res) => {
    var coords = req.body

    quizgen.generateQuiz().then((data) => {
        res.send(data)
    })
})

/**
 * @swagger
 * /location:
 *    post:
 *      description: Use to retrieve the address from given coordinates
 *      responses:
 *        '200':
 *         description: Successfully converted coordinates to address
 */
//returns an address from given coordinates
router.post('/location', async (req, res) => {
    var coords = req.body
    locFromCoords(coords).then((loc) => res.send(loc[0]))
})

//uses node geocoder to return location data from a set of coords
locFromCoords = (coords) => {
    return new Promise((resolve, reject) => {
        geocoder.reverse(coords).then((loc) => resolve(loc))
    })
}



//authentication middleware 
function authenticateToken(req, res, next) {


    data = req.body
    let userId = data.id
    //check if request has authorization header
    const header = req.headers['authorization']
    console.log(header)
    let token = header && header.split(' ')[1]


    //if token does not exist 
    if (token == null) {
        console.log("no token :(")
        return res.sendStatus(401)
    }


    console.log("token exists")

    //verifying the token

    
    jwt.verify(token, process.env.JWT_KEY, (err,decoded) => {
        console.log("hello jwt")
        if (err) {
            console.log("nope")
            return res.sendStatus(403)
        } else {
            console.log("yes")
            console.log(decoded)
            if (userId == decoded.googleId){
                console.log("userid checked")
                next()
            }
            else{
                res.sendStatus(403)
            }
           
        }
    })
    
}
module.exports = router
