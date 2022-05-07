var express = require('express')
var router = express.Router()
var database = require('../../database.js')
var quizgen = require('../../quiz-gen-v2.js')
var profilePicture = require('../../profile-picture.js')
var jwt = require('jsonwebtoken')

var fs = require('fs').promises

const NodeGeocoder = require('node-geocoder')
const e = require('express')


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
 * components:
 *  schemas:
 *      User : # <----------
 *          type: object
 *          required: 
 *              - id
 *          properties:
 *              id:
 *                  description: The user's google id number
 *                  type: integer
 *                  example: 0
 *      Query : # <----------
 *          required: 
 *              - email
 *              - query
 *          properties:
 *              email:
 *                  description: The user's email
 *                  type: string
 *                  example: James@gmail.com
 *              query:
 *                  description: User's query
 *                  type: string
 *                  example: the website is broken
 *      Location:
 *          type: object
 *          required:
 *              - lat
 *              - lon
 *          properties:
 *              lat: 
 *                  description: The latitude of location
 *                  type: number
 *                  example: 52.4429616
 *              lon:
 *                  description: The longitude of location
 *                  type: number
 *                  example: -1.9403622
 *      Score:
 *          type: object
 *          required:
 *              - score
 *              - percentage
 *              - id
 *          properties:
 *              score: 
 *                  description: The latitude of location
 *                  type: integer
 *                  example: 5
 *              percentage:
 *                  description: The percentage of your score
 *                  type: number
 *                  example: 60
 *              id:
 *                  description: User id
 *                  type: integer
 *                  example: 1
 *          
 */
/**
 * @swagger
 * /gdpr:
 *    get:
 *      tags:
 *          - User
 *      summary: Get all gdprs
 *      security:
 *          - bearerAuth: []
 *      responses:
 *        200:
 *         description: Successfully received GDPR status                 
 *        401: 
 *          description: Unauthorized user
 *        403:
 *          description: Forbidden action
 */
//checks if users have signed the GDPR
router.get('/gdpr', authenticateAdmin, async (req, res) => {
    console.log("getting all gdprs with admin")
    let gdpr = await database.getGDPRs();
    console.log(gdpr)
    res.send(gdpr)
})
/**
 * @swagger
 * /gdpr:
 *    post:
 *      tags:
 *          - User
 *      summary: Check if user has signed the GDPR
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          description: the user to get gdpr
 *          content: 
 *              application/json:
 *                  schema:  
 *                      $ref: '#/components/schemas/User'  # <----------
 *      responses:
 *        200:
 *         description: Successfully received GDPR status                 
 *        400:
 *          description: Invalid or missing user ID
 *        404:
 *          description: Requested resource not found
 */
//checks if users have signed the GDPR
router.post('/gdpr', authenticateToken, async (req, res) => {
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
 * /gdpr:
 *    put:
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
 *                      $ref: '#/components/schemas/User'  # <----------
 *      responses:
 *        200:
 *         description: Successfully set GDPR status to 1
 *        400:
 *          description: Invalid status value
 *        404:
 *          description: Requested resource not found
 */
//sets a user's gdpr status to 1
router.put('/gdpr', authenticateToken, async (req, res) => {
    let id = req.body.id
    // let user choose gdpr status
    let status = await database.setGDPR(id, 1)
    res.sendStatus(status)

})


/**
 * @swagger
 * /gdpr/{id}:
 *    delete:
 *      tags:
 *          - User
 *      summary: Delete gdpr
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID of the user to retrieve
 *            schema:
 *              type: integer
 *              example: 102333127248222698957
 *      responses:
 *        200:
 *         description: Successfully deleted gdpr
 *        404:
 *         description: Requested resource does not exist
 *        401: 
 *         description: Unauthorized user
 */
router.delete('/gdpr/:id', authenticateAdmin, async (req, res) => {
    let deleteId = req.params.id
    let status = await database.setGDPR(deleteId, 0)
    res.send(status)
})




/**
 * @swagger
 * /users/{id}/scores:
 *    get:
 *      tags:
 *          - User
 *      summary: Get scores by user ID
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID of the user
 *            schema:
 *              type: integer
 *              example: 102333127248222698957
 *      responses:
 *        200:
 *         description: Successfully retrieved scores
 *        404:
 *         description: Requested resource does not exist
 *        401: 
 *         description: Unauthorized user
 */
router.get('/users/:id/scores', authenticateAdmin, async (req, res) => {
    let id = req.params.id

    let scores = await database.getScoresById(id);
    
    res.send(scores)
})



/**
 * @swagger
 * /users:
 *    get:
 *      tags:
 *          - User
 *      summary: Get users
 *      security:
 *          - bearerAuth: []
 *      responses:
 *        200:
 *         description: Successfully retrieved users
 *        401: 
 *         description: Unauthorized user
 */
router.get('/users', authenticateAdmin, async (req, res) => {
    let users = await database.getUsers();
    res.send(users)
})
//users
/**
 * @swagger
 * /users:
 *    post:
 *      tags:
 *          - User
 *      summary: Add a user to the database if they don't already exist otherwise login
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
router.post('/users', async (req, res) => {
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
 * /profile-picture/{id}:
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
 *          description: User not found
 *      
 */
router.get('/profile-picture/:id', async (req, res) => {
    let id = req.params.id
    console.log('fetching profile picture for ' + id)


    let exists = await database.userExists(id)
    if (!exists) {
        res.send(404)
    }
    else {
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
 * /profile-picture:
 *    put:
 *      tags:
 *          - User
 *      summary: Reset a user's profile picture
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          description: the user to reset profile picture
 *          content: 
 *              application/json:
 *                  schema:  
 *                      $ref: '#/components/schemas/User'  # <----------
 *      responses:
 *        200:
 *         description: Successfully reset profile picture
 *        400:
 *          description: Invalid or missing parameters
 */
router.put('/profile-picture', authenticateToken, async (req, res) => {
    let id = req.body.id
    let pfp = JSON.stringify(profilePicture.generateProfilePicture())

    let status = await database.setProfilePicture(id, pfp)
    res.sendStatus(status)
})




/**
 * @swagger
 * /profile-picture/{id}/colour:
 *    put:
 *      tags:
 *          - User
 *      summary: Reset a user's profile picture colour
 *      security:
 *          - bearerAuth: []
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
 *         description: Successfully reset profile picture
 *        400:
 *          description: Invalid or missing parameters
 *        401:
 *          description: Unauthorized
 */
router.put('/profile-picture/:id/colour', authenticateAdmin, async (req, res) => {
    let id = req.params.id

    let profile = await database.getProfilePicture(id)
    let profilejson = JSON.parse(profile)

    //generate color
    let col = profilePicture.randomColour()
    profilejson.colour = col

    let pfp = JSON.stringify(profilejson)

    let status = await database.setProfilePicture(id, pfp)
    res.sendStatus(status)
})


/**
 * @swagger
 * /profile-picture:
 *    post:
 *      tags:
 *          - User
 *      summary: Create a user's profile picture
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          description: The user to reset profile picture
 *          content: 
 *              application/json:
 *                  schema:  
 *                      $ref: '#/components/schemas/User'  # <----------
 *      responses:
 *        200:
 *          description: Successfully reset profile picture
 *        400:
 *          description: Invalid or missing parameters
 *        401: 
 *          description: Unauthorized user
 */
router.post('/profile-picture', authenticateToken, async (req, res) => {
    let id = req.body.id
    let pfp = JSON.stringify(profilePicture.generateProfilePicture())

    let status = await database.setProfilePicture(id, pfp)
    res.sendStatus(status)
})



/**
 * @swagger
 * /profile-picture/{id}:
 *    delete:
 *      tags:
 *          - User
 *      summary: Delete user's profile picture
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID of the user to delete profile picture
 *            schema:
 *              type: integer
 *              example: 102333127248222698957
 *      responses:
 *        200:
 *         description: Successfully deleted profile picture
 *        404:
 *         description: Requested resource does not exist
 *        401: 
 *         description: Unauthorized user
 */
router.delete('/profile-picture/:id', authenticateAdmin, async (req, res) => {
    let id = req.params.id


    let exists = await database.userExists(id)
    if (!exists) {
        res.send(404)
    } else {
        let status = await database.deleteProfilePic(id)
        res.sendStatus(status)
    }

})





/**
 * @swagger
 * /users:
 *    delete:
 *      tags:
 *          - User
 *      summary: Delete user account 
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          description: User to delete
 *          content: 
 *              application/json:
 *                  schema:  
 *                      required: 
 *                          - id
 *                      properties:
 *                          id :
 *                              description: User's google id 
 *                              type: integer
 *      responses:
 *          200:
 *              description: Successfully deleted user
 *          400:
 *              description: Bad request
 *          404:
 *              description: User not found
 *          401: 
 *              description: Unauthorized user
 */
router.delete('/users', authenticateToken, async function (req, res) {

    data = req.body
    let userId = data.id


    let exists = await database.userExists(userId)
    if (!exists) {
        res.send(404)
    }
    else {
        // add a layer of security

        //to do cascading delete
        let datares = await database.deleteUser(userId)


        res.sendStatus(datares)
    }
})




/**
 * @swagger
 * /users:
 *    put:
 *      tags:
 *          - User
 *      summary: Update user's name 
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          description: User to update
 *          content: 
 *              application/json:
 *                  schema:  
 *                      required: 
 *                          - id
 *                          - name
 *                      properties:
 *                          id :
 *                              description: User's google id 
 *                              type: integer
 *                          name: 
 *                              description: User's username
 *                              type: string
 *      responses:
 *          200:
 *              description: Successfully deleted user
 *          404:
 *              description: User not found
 *          401:
 *              description: Unauthorized user
 */
router.put('/users', authenticateAdmin, async function (req, res) {
    let id = req.body.id
    let userName = req.body.name

    let exists = await database.userExists(id)
    if (!exists) {
        res.send(404)
    }
    else {
        let status = await database.setUsername(id, userName)
        res.sendStatus(status)
    }

})



/**
 * @swagger
 * /scores:
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


//scores
/**
 * @swagger
 * /scores:
 *    post:
 *      tags:
 *          - Quiz
 *      summary: Add a user's score to the database
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          description: User to reset profile picture
 *          content: 
 *              application/json:
 *                  schema:  
 *                      $ref: '#/components/schemas/Score'  # <----------
 *      responses:
 *        200:
 *         description: Successfully saved score
 *        400:
 *         description: Invalid or missing parameters
 */
//save a user's score to the database
router.post('/scores', authenticateToken, (req, res) => {
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
 * /leaderboard:
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


/**
 * @swagger
 * /support:
 *    post:
 *      tags:
 *          - Quiz
 *      summary: Receive and handle support queries
 *      requestBody:
 *          description: Support query
 *          content: 
 *              application/json:
 *                  schema:  
 *                      $ref: '#/components/schemas/Query'  # <----------
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
 * /support:
 *    delete:
 *      tags:
 *          - Quiz
 *      summary: Delete support queries
 *      security:
 *          - bearerAuth: []
 *      responses:
 *        200:
 *         description: Successfully deleted support query
 *        400:
 *         description: Invalid query
 */
//delete all request queries
router.delete('/support',authenticateAdmin, async (req, res) => {
    fs.readFile('./support/requests.json')
        .then((raw) => {

            return fs.writeFile('./support/requests.json', JSON.stringify([]))
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
 * /support:
 *    put:
 *      tags:
 *          - Quiz
 *      summary: Change support queries
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          description: List of support queries to change to 
 *          content: 
 *              application/json:
 *                  schema:  
 *                      properties:
 *                          queries:
 *                              type: array
 *                              description: Array of queries to change to
 *                              items: 
 *                                  $ref: '#/components/schemas/Query'  # <----------
 *      responses:
 *        200:
 *         description: Successfully changed support queries
 *        400:
 *         description: Bad query
 */
router.put('/support', authenticateAdmin, async (req, res) => {
    json = req.body

    fs.readFile('./support/requests.json')
        .then((raw) => {
            return fs.writeFile('./support/requests.json', JSON.stringify([json]))
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
 * /support:
 *    get:
 *      tags:
 *          - Quiz
 *      summary: Get support queries
 *      responses:
 *        200:
 *         description: Successfully changed support queries
 *        400:
 *         description: Bad query
 */
router.get('/support', async (req, res) => {
    json = req.body

    fs.readFile('./support/requests.json')
        .then((raw) => {
            return JSON.parse(raw)
        }).then(data => {
            res.send(data)
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
 *      requestBody:
 *          description: Location to generate quiz
 *          content: 
 *              application/json:
 *                  schema:  
 *                      $ref: '#/components/schemas/Location'  # <----------
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
 * /location:
 *    post:
 *      tags:
 *          - Quiz
 *      summary: Retrieve the address from given coordinates
 *      requestBody:
 *          description: Coordinates of the user
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


    //convert coords to location
    locFromCoords(coords).then((loc) => {
        //check if city is already in database
        database.getCity(loc[0].city).then((gets) => {
  
            //if city doesnt exist insert 
            if (!gets[0]) {
                console.log("inserting")
                database.addCity(loc[0].city).then((rows) => {
                    console.log(rows)
                })
            }

            //send response
            res.send(loc[0])
        });
    })

})






/**
 * @swagger
 * /location:
 *    get:
 *      tags:
 *          - Quiz
 *      summary: Retrieve all cities that use the app
 *      responses:
 *        200:
 *         description: Successfully received cities
 *        400:
 *         description: Invalid coordinates
 */
//returns an address from given coordinates
router.get('/location', async (req, res) => {
    let cities = await database.getCities();
    res.send(cities)
})


/**
 * @swagger
 * /location:
 *    delete:
 *      tags:
 *          - Quiz
 *      summary: Delete city
 *      requestBody:
 *          description: City to delete
 *          content: 
 *              application/json:
 *                  schema:  
 *                      type: object
 *                      properties:
 *                          city:
 *                              description: City's name to delete
 *                              type: string
 *                              example: Birmingham
 *      responses:
 *        200:
 *         description: Successfully deleted city
 *        400:
 *         description: Invalid city
 */
//returns an address from given coordinates
router.delete('/location', async (req, res) => {
    var city = req.body.city

    let exists = await database.getCity(city)
    if (!exists) {
        res.sendStatus(404)
    } else {
        let deleted = await database.deleteCity(city)
        res.sendStatus(deleted)
    }
})







/**
 * @swagger
 * /location:
 *    put:
 *      tags:
 *          - Quiz
 *      summary: Update the city
 *      requestBody:
 *          description: City to update
 *          content: 
 *              application/json:
 *                  schema:  
 *                      type: object
 *                      properties:
 *                          id: 
 *                              description: Id of the city
 *                              type: integer
 *                              example: 1
 *                          city:
 *                              description: City's name
 *                              type: string
 *                              example: Birmingham
 *      responses:
 *        200:
 *         description: Successfully updated city
 *        400:
 *         description: Invalid city
 */
//returns an address from given coordinates
router.put('/location', async (req, res) => {
    let id = req.body.id
    var city = req.body.city


    let updated = await database.updateCity(id, city)

    res.sendStatus(updated)



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


    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        console.log("hello jwt")
        if (err) {
            console.log("nope")
            return res.sendStatus(403)
        } else {
            console.log("yes")
            console.log(decoded)
            if (userId == decoded.googleId) {
                console.log("userid checked")
                next()
            }
            else {
                console.log("invalid token")
                res.sendStatus(403)
            }

        }
    })

}


//authentication admins
function authenticateAdmin(req, res, next) {
    console.log("hello")

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


    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        console.log("hello jwt")
        if (err) {
            console.log("nope")
            return res.sendStatus(403)
        } else {
            console.log("yes")
            console.log(decoded)



            //database fetch admins 
            database.getAdmins(decoded.googleId).then(data => {
                console.log(typeof (data))
                console.log(data.length)
                if (data.length) {
                    next()
                }
                else {
                    console.log('your are not admin')
                    res.send(401)
                }
            })




        }
    })

}
module.exports = router
