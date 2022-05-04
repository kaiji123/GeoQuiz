var mysql = require('mysql2');
var profilePicture = require('./profile-picture.js')

function makeConnection() {
    return mysql.createConnection({
        host: `${process.env.HOSTNAME}`,
        port: `${process.env.DBPORT}`,
        user: `${process.env.DBUSER}`,
        password: `${process.env.DBPASSWORD}`,
        database: `${process.env.DBDATABASE}`

    });
}

//save a user's score and percentage 
async function addScore(id, score, percentage) {
    var connection = makeConnection()

    let sql = "INSERT INTO scores (userId, score, percentage) VALUES ('" 
        + id + "', " 
        + score + ", " 
        + percentage + ")"

    try {
        const [rows, fields] = await connection.promise().query(sql);
        connection.end();
        return 200;
    } catch (err) {
        console.log(err);
        return 502;
    }
}


//add a city
async function addCity(city) {
    var connection = makeConnection()

    let sql = "INSERT INTO cities (cityId, city) VALUES (NULL, '" 
        + city + "')"

    try {
        const [rows, fields] = await connection.promise().query(sql);
        connection.end();
        return 200;
    } catch (err) {
        console.log(err);
        return 502;
    }
}

//add a city
async function getCity(city) {
    var connection = makeConnection()


    let sql = "SELECT * FROM cities WHERE city = '" + city+"'"
    try {
        const [rows, fields] = await connection.promise().query(sql);
        connection.end();
        return rows
    } catch (err) {
        console.log(err);
        return 502;
    }
}


//add a city
async function getCities(name) {
    var connection = makeConnection()


    let sql = "SELECT * FROM cities"
    try {
        const [rows, fields] = await connection.promise().query(sql);
        connection.end();
        return rows
    } catch (err) {
        console.log(err);
        return 502;
    }
}


//add a city
async function updateCity(id, city) {
    var connection = makeConnection()


    let sql =  "UPDATE cities SET city = '" + city + "' WHERE cityId = " + id
    try {
        const [rows, fields] = await connection.promise().query(sql);
        connection.end();
        return 200
    } catch (err) {
        console.log(err);
        return 502;
    }
}


async function deleteCity(city){
    var connection = makeConnection()
    let sql = "DELETE FROM cities WHERE city = '" + city+"'"
    try {
        const [rows, fields] = await connection.promise().query(sql);
        connection.end();
        return 200
    } catch (err) {
        console.log(err);
        return 502;
    }
}

//return an ordered list of users and their scores
async function getLeaderboard(){
    var connection = makeConnection()

    let sql = "SELECT users.userId, users.name, scores.score FROM scores INNER JOIN users ON scores.userId = users.userId"
    try {
        const [rows, fields] = await connection.promise().query(sql);
        let leaderboard = {};

        rows.forEach((score) => {
            let userId = score.userId;

            //tally scores based on user id
            if (leaderboard[userId] == null) {
                leaderboard[userId] = { 'name': score.name, 'total': score.score };
            }
            else {
                leaderboard[userId].total += score.score;
            }
        });

        //discard id after accumulating scores
        leaderboard = Object.values(leaderboard);

        //sort leaderboard in descending oder
        leaderboard = leaderboard.sort((a, b) => {
            return a.total > b.total ? -1 : 1;
        });

        connection.end();
        return leaderboard;
    } catch (err) {
        console.log(err)
        return 502;
    }

}

//adds a user to the users table
async function addUser(userId, name) {
    var connection = makeConnection()

    //randomly generated profile image in our format
    let pfp = JSON.stringify(profilePicture.generateProfilePicture())
    console.log(pfp)

    let sql = "INSERT INTO users(userId, name, pfp) VALUES (" + userId + ", '" + name + "', '" + pfp + "')"

    try{
        const [rows, fields] = await connection.promise().query(sql)
        connection.end();
        return 200
    }
    catch(err){
        console.log(err)
        return 502
    }
}


async function deleteProfilePic(id){
    let pfp = JSON.stringify({'color': 'black', 'pixels': []})
    var conn = makeConnection()

    
    let sql = "UPDATE users SET pfp = '" + pfp + "' WHERE userId = " + id
    try {
        const [rows, fields] = await conn.promise().query(sql);
        conn.end()
        return 200

    }
    catch(err){
        console.log(err)
        return 502
    }
}

async function userExists(userId){
    var conn = makeConnection()
    let sql = "SELECT EXISTS(SELECT 1 FROM users WHERE userId = " + userId + ")"

    try{
        const[rows, fields] = await conn.promise().query(sql)
        
        //faulty code
        exists = Object.values(rows[0])[0] == 1 ? true : false

        
        console.log(rows)
        console.log(exists)
        return exists
    }
    catch(err){
        console.log(err)
        return 502
    }
}

async function userExist2(userId,username){
    var conn = makeConnection()
    let sql = "SELECT EXISTS(SELECT 1 FROM users WHERE userId = " + userId + " AND name = '"+ username +"')"

    try{
        const[rows, fields] = await conn.promise().query(sql)
        exists = Object.values(rows[0])[0] == 1 ? true : false
        return exists
    }
    catch(err){
        console.log(err)
        return 502
    }
}

//removes a user from users 
async function deleteUser(userId){
    var connection = makeConnection()
    let sql = "DELETE FROM users WHERE userId = " + userId
    
    try{
        const [rows, fields] = await connection.promise().query(sql) 
        connection.end()
        return 200

    }
    catch(err){
        console.log(err)
        return 502
    }
}

async function getGDPR(id){
    var conn = makeConnection()
    let sql = "SELECT gdpr FROM users WHERE userId = " + id
    try {
        const [rows, fields] = await conn.promise().query(sql);
        console.log(rows)
        conn.end()

        return rows[0]

    }
    catch(err){
        console.log(err)
        return 502
    }
}

async function getGDPRs(){
    var conn = makeConnection()
    let sql = "SELECT userId, gdpr FROM users"
    try {
        const [rows, fields] = await conn.promise().query(sql);
        console.log(rows)
        conn.end()

        return rows

    }
    catch(err){
        console.log(err)
        return 502
    }
}

async function setGDPR(id, val){
    var conn = makeConnection()
    let sql = "UPDATE users SET gdpr = " + val + " WHERE userId = " + id
    try {
        const [rows, fields] = await conn.promise().query(sql);
        conn.end()
        return 200

    }
    catch(err){
        console.log(err)
        return 502
    }
}


async function setUsername(id, name){
    var conn = makeConnection()
    let sql = "UPDATE users SET name = '" + name + "' WHERE userId = " + id
    try {
        const [rows, fields] = await conn.promise().query(sql);
        conn.end()
        return 200

    }
    catch(err){
        console.log(err)
        return 502
    }
}
async function getProfilePicture(id){
    var conn = makeConnection()
    let sql = "SELECT pfp FROM users WHERE userId = " + id
    try {
        const [rows, fields] = await conn.promise().query(sql);
        conn.end()
        return rows[0].pfp

    }
    catch(err){
        console.log(err)
        return 502
    }
}

async function setProfilePicture(id, pfp){
    var conn = makeConnection()
    let sql = "UPDATE users SET pfp = '" + pfp + "' WHERE userId = " + id
    try {
        const [rows, fields] = await conn.promise().query(sql);
        conn.end()
        return 200

    }
    catch(err){
        console.log(err)
        return 502
    }
}

async function deleteScore(id){
    var conn = makeConnection()
    let sql = "DELETE FROM scores WHERE scoreId = " + id
    try {
        const [rows, fields] = await conn.promise().query(sql);
        conn.end()
        return 200

    }
    catch(err){
        console.log(err)
        return 502
    }
}

async function getScores(){
    var connection = makeConnection()
    let sql = "SELECT * FROM scores"
    try {
        const [rows, fields] = await connection.promise().query(sql);
        connection.end();
        return rows
    }catch(err){
        console.log(err)
        return 502
    }
}


async function getScoresById(id){
    var connection = makeConnection()
    let sql = "SELECT * FROM scores WHERE userId = "+ id
    try {
        const [rows, fields] = await connection.promise().query(sql);
        connection.end();
        return rows
    }catch(err){
        console.log(err)
        return 502
    }
}

async function selectUsersPoints(id){
    var connection = makeConnection()
    let sql = "SELECT scores FROM scores WHERE userId =" + id

    try{
        const [rows, fields] = await connection.promise().query(sql)
        console.log(rows)
        connection.end()

        return rows
    }
    catch(err){
        console.log(err)
        return 502
    } 
}

async function getUsers(){
    var conn = makeConnection()

    let sql = "SELECT * FROM users"
    try{
        const [rows, fields] = await conn.promise().query(sql)
        console.log(rows)
        conn.end()
        
        return rows
    }
    catch(err){
        console.log(err)
        return 502
    }
}

async function getAdmins(id){
    var conn = makeConnection()

    let sql = "SELECT * FROM admins WHERE userID = " + id
    try{
        const [rows, fields] = await conn.promise().query(sql)
        console.log(rows)
        conn.end()
        
        return rows
    }
    catch(err){
        console.log(err)
        return 502
    }
}

module.exports = {
    getAdmins,
    getLeaderboard,
    addUser,
    deleteUser,
    userExists,
    userExist2,
    addScore,
    getScores,
    getGDPR,
    setGDPR,
    getGDPRs,
    getProfilePicture,
    setProfilePicture,
    selectUsersPoints,
    getUsers,
    deleteProfilePic,
    setUsername,
    addCity,
    updateCity,
    deleteCity,
    getCity,
    getCities,
    getScoresById
}

