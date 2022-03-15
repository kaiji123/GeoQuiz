const res = require('express/lib/response');
var mysql = require('mysql2');

function makeConnection() {
    var connection = mysql.createConnection({
        host: `${process.env.HOSTNAME}`,
        port: `${process.env.DBPORT}`,
        user: `${process.env.DBUSER}`,
        password: `${process.env.DBPASSWORD}`,
        database: `${process.env.DBDATABASE}`

    });
    return connection
}

//save a user's score and percentage 
function addScore(id, score, percentage) {
    var connection = makeConnection()

    connection.connect(function (err) {
        if (err) throw err;
        let sql = "INSERT INTO scores (userId, score, percentage) VALUES ('" 
            + id + "', " 
            + score + ", " 
            + percentage + ")"
        connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result);

            connection.end();
        });
    });
}

//return an ordered list of users and their scores
function getLeaderboard(){
    var connection = makeConnection()

    let sql = "SELECT users.userId, users.name, scores.score FROM scores INNER JOIN users ON scores.userId = users.userId"
    return connection.promise().query(sql).then(([rows, fields]) => {
        console.log(rows)
        let leaderboard = {};

        rows.forEach((score) =>{
            let userId = score.userId

            //tally scores based on user id
            if(leaderboard[userId] == null){
                leaderboard[userId] = {'name': score.name, 'total': score.score}
            }
            else{
                leaderboard[userId].total += score.score
            }
        })

        //discard id after accumulating scores
        leaderboard = Object.values(leaderboard)

        //sort leaderboard in descending oder
        leaderboard = leaderboard.sort((a,b)=>{
            return a.total > b.total ? -1 : 1
        })
        console.log(leaderboard)
        connection.end();
        return leaderboard
    }).catch((err) =>{
        console.log(err)
    })

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
        connection.query("delete from users where userId =" + userId, function (err, result, fields) {
            if (err) throw err;
            console.log(result);

            connection.end();
        });
    });
}

//selects the given users score

module.exports = {
    getLeaderboard,
    addUser,
    deleteUser,
    addScore,

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
    },


  getScores(req,res){
    var connection = makeConnection()

    //make connection

    connection.connect(function (err) {
        if (err) throw err;
        connection.query("select * from scores", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.send(result)
            connection.end();
            return result
        });
    });
    }
}
