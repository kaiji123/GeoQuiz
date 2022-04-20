var express = require('express')
var router = express.Router()
var database = require('./database.js')
var quizgen = require('./quiz-gen-v2.js')
var profilePicture = require('./profile-picture.js')
var jwt = require('jsonwebtoken')

var fs = require('fs').promises

const NodeGeocoder = require('node-geocoder')
const { NOTFOUND } = require('dns')

//node geocoder configuration
const options = {
    provider: 'google',
    apiKey: process.env.GEOCODE_KEY,
    formatter: null
}

const geocoder = NodeGeocoder(options)


/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:            
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 * security:
 *   - bearerAuth:[]             
 */


/**
 * @swagger
 * definitions:
 *  User : # <----------
 *     required: 
 *        - id
 *     properties:
 *        id:
 *          description: the user's google id number
 *          type: integer
 *          example: 0
 */

/**
 * @swagger
 * /api/get-gdpr:
 *    post:
 *      tags:
 *          - User
 *      summary: Check if user has signed the GDPR
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          description: the user to set gdpr
 *          content: 
 *              application/json:
 *                  schema:  
 *                      $ref: '#/definitions/User'  # <----------
 *      responses:
 *        200:
 *         description: Successfully signed GDPR                 
 *        400:
 *          description: Invalid or missing user ID
 *        404:
 *          description: Requested resource not found
 */
//checks if users have signed the GDPR
router.post('/get-gdpr',authenticateToken,  async (req, res) => {
    let id = req.body.id
    console.log("hello")
    console.log(req.body)
    let gdpr = await database.getGDPR(id)
    console.log(gdpr)
    res.send(gdpr)
})
//GDPR
/**
 * @swagger
 * /api/set-gdpr:
 *    post:
 *      tags:
 *          - User
 *      summary: Set user's GDPR status to 1
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          description: the user to set gdpr
 *          content: 
 *              application/json:
 *                  schema:  
 *                      $ref: '#/definitions/User'  # <----------
 *      responses:
 *        200:
 *         description: Successfully set GDPR status to 1
 *        400:
 *          description: Invalid status value
 *        404:
 *          description: Requested resource not found
 */
//sets a user's gdpr status to 1
router.post('/set-gdpr',authenticateToken, async (req, res) => {
    let id = req.body.id
    let status = await database.setGDPR(id, 1)
    res.sendStatus(status)

})



//users
/**
 * @swagger
 * /api/add-user:
 *    post:
 *      tags:
 *          - User
 *      summary: Add a user to the database if they don't already exist
 *      requestBody:
 *          description: the user to add
 *          content: 
 *              application/json:
 *                  schema:  
 *                      required: 
 *                          - id
 *                          - name
 *                      properties:
 *                          id :
 *                              description: user's google id 
 *                              type: integer
 *                          name:
 *                              description: username
 *                              type: string
 *                      
 *      responses:
 *        200:
 *         description: Successfully added user
 *        400:
 *          description: User already exists
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
//PFPs
/**
 * @swagger
 * /api/profile-picture/{id}:
 *    get:
 *      tags:
 *          - User
 *      summary: Fetch a profile picture
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID of the user to retrieve
 *            schema:
 *              type: integer
 *            example: 111843877506203660742
 *      responses:
 *        200:
 *         description: Successfully fetched profile picture
 *        400:
 *          description: Invalid or missing parameter
 *        404: 
 *          description: user not found
 *      
 */
router.get('/profile-picture/:id', async (req, res) => {
    let id = req.params.id
    console.log('fetching profile picture for ' + id)


    let exists = await database.userExists(id)
    if (!exists){
        res.send(404)
    }
    else{
    let pixels = await database.getProfilePicture(id)

    //turn our json into an image
    let data = profilePicture.renderProfilePicture(JSON.parse(pixels), 500)
    res.setHeader('content-type', 'image/png');
    res.send(data)
    }
})
//PFPs
/**
 * @swagger
 * /api/reset-pfp:
 *    post:
 *      tags:
 *          - User
 *      summary: Reset a user's profile picture
 *      parameters:
 *         - in: query
 *           name: userId
 *           required: true
 *           description: Numeric ID of the user to retrieve
 *           schema:
 *              type: integer
 *           example: 111843877506203660742
 *         - in: query
 *           name: pfp
 *           required: true
 *           description: New profile picture
 *      responses:
 *        200:
 *         description: Successfully reset profile picture
 *        400:
 *          description: Invalid or missing parameters
 */
router.post('/reset-pfp', async (req, res) => {
    let id = req.body.id
    let pfp = JSON.stringify(profilePicture.generateProfilePicture())

    let status = await database.setProfilePicture(id, pfp)
    res.sendStatus(status)
})


/**
 * @swagger
 * /api/users:
 *    delete:
 *      tags:
 *          - User
 *      summary: Delete user account 
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *         - in: query
 *           name: userId
 *           required: true
 *           description: Numeric ID of the user
 *           schema:
 *              type: integer
 *           example: 111843877506203660742
 *      requestBody:
 *          required: true
 *      responses:
 *          200:
 *              description: Successfully deleted user
 *          400:
 *              description: User not found
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
 * /api/scores:
 *    get:
 *      tags:
 *          - Quiz
 *      summary: Fetch scores
 *      responses:
 *        200:
 *         description: Successfully fetched scores
 *        404:
 *          description: Requested resource does not exist
 */
router.get('/scores', async (req, res) => {
    let scores = await database.getScores()
    res.send(scores)
})

/**
 * @swagger
 * /api/leaderboard:
 *    get:
 *      tags:
 *          - Quiz
 *      summary: Fetch the leaderboard
 *      responses:
 *        200:
 *         description: Successfully fetched leaderboard
 *         content:
 *          application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      type: array
 *                      items:
 *                          type: string
 *                          example: [[1, Jack Jazrawy-Brown, 142506], [2, Faiez Raja, 159]]
 *        404:
 *          description: Leaderboard not found
 */
router.get('/leaderboard', async (req, res) => {
    let leaderboard = await database.getLeaderboard()
    res.send(leaderboard)

})
//scores
/**
 * @swagger
 * /api-docs/save-score:
 *    post:
 *      tags:
 *          - User
 *      summary: Add a user's score to the database
 *      parameters:
 *         - in: query
 *           name: userId
 *           required: true
 *           description: Numeric ID of the user to retrieve
 *           schema:
 *              type: integer
 *           example: 111843877506203660742
 *      responses:
 *        200:
 *         description: Successfully saved score
 *        400:
 *         description: Invalid or missing parameters
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
 *      tags:
 *          - Quiz
 *      summary: Receive and handle support queries
 *      responses:
 *        200:
 *         description: Successfully received support query
 *        400:
 *         description: Invalid query
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
 *      tags:
 *          - Quiz
 *      summary: Generate a quiz
 *      parameters:
 *         - in: cookie
 *           name: coords
 *           required: true
 *           description: Coordinates of users location
 *           schema:
 *              type: integer
 *           example: 52.4429616,-1.9403622
 *      responses:
 *        200:
 *         description: Successfully generated a quiz
 *        400:
 *         description: Location not found
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
 * /api/location:
 *    post:
 *      tags:
 *          - Quiz
 *      summary: Retrieve the address from given coordinates
 *      requestBody:
 *          description: the user to set gdpr
 *          content: 
 *              application/json:
 *                  schema:  
 *                      type: object
 *                      properties:
 *                          lat: 
 *                              type: number
 *                              example: 52.4429616
 *                          lon:
 *                              type: number
 *                              example: -1.9403622
 *      responses:
 *        200:
 *         description: Successfully converted coordinates to address
 *        400:
 *         description: Invalid coordinates
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
                console.log("invalid token")
                res.sendStatus(403)
            }
           
        }
    })
    
}
module.exports = router
