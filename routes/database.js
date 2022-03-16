var mysql = require('mysql2');

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
function addScore(id, score, percentage) {
    var connection = makeConnection()

    let sql = "INSERT INTO scores (userId, score, percentage) VALUES ('" 
        + id + "', " 
        + score + ", " 
        + percentage + ")"

    return connection.promise().query(sql).then(([rows,fields]) => {
        connection.end()
        return 200
    }).catch((err) => {
        console.log(err)
        return 502
    });
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
        return 502;
    }

}

//adds a user to the users table
function addUser(userId, name) {
    var connection = makeConnection()

    connection.connect(function (err) {
        if (err) throw err;
        connection.query("INSERT INTO users(userId, name) VALUES (" + userId + ", '" + name + "')", function (err, result, fields) {
            if (err) throw err;
            console.log(result);

            connection.end();
        });
    });
}

//removes a user from users 
function deleteUser(userId){
    var connection = makeConnection()

    connection.connect(function (err) {
        if (err) throw err;
        connection.query("DELETE FROM users WHERE userId =" + userId, function (err, result, fields) {
            if (err) throw err;
            console.log(result);

            connection.end();
        });
    });
}

async function getGDPR(id){
    var conn = makeConnection()
    let sql = "SELECT gdpr FROM users WHERE userId = " + id
    console.log(sql)
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

//selects the given users score

module.exports = {
    getLeaderboard,
    addUser,
    deleteUser,
    addScore,
    getScores,
    getGDPR,
    setGDPR,

    //selecting user points
    selectUsersPoints: function (id) {
        //make connection
        var connection = makeConnection()
        connection.connect(function (err) {
            if (err) throw err;
            connection.query("SELECT scores FROM scores WHERE userId =" + id, function (err, result, fields) {
                if (err) throw err;
                console.log(result);

                connection.end();
            });
        });
    },

    //this is get users function to get all users
    getUsers: function () {
        //make connection 
        var connection = makeConnection()

        connection.connect(function (err) {
            if (err) throw err;
            connection.query("SELECT * from users", function (err, result, fields) {
                if (err) throw err;
                console.log(result);

                connection.end();
                return result;
            });
        });
    }
}

