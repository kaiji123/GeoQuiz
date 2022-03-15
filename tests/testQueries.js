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

//selects the given users score
module.exports = {

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
    //adds user to the users table
    addUser: function (userid, name) {


        var connection = makeConnection()

        //make connection

        connection.connect(function (err) {
            if (err) throw err;
            connection.query("INSERT INTO users(userId, name) VALUES (" + userid + ", '" + name + "')", function (err, result, fields) {
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

    // this is get top 5 users ranking in the world function 
    getTop5: function () {
        // use makeConnection to make a connection to database , please assign it to connection variable
        var connection = makeConnection()



        connection.query("SELECT users.name,scores.score from scores inner join users on scores.userId = users.userId order by scores.score desc limit 5", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
       

            connection.end();
            return result
        });
    },

    getLeaderboard: function () {
        var connection = makeConnection()
        connection.query("SELECT users.userId, users.name, scores.score FROM scores INNER JOIN users ON scores.userId = users.userId", function (err, result, fields) {
            if (err) throw err;
            let leaderboard = {};

            result.forEach((score) =>{
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

          

            connection.end();
            return result
        });
    },

    

    addScore: function (id, score, percentage) {
        var connection = makeConnection()
        console.log([id, score, percentage])
        //make connection

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
    },

    //updates a users score in the scores table
    updateScore(id, score) {
        var connection = makeConnection()

        //make connection

        connection.connect(function (err) {
            if (err) throw err;
            connection.query("UPDATE scores SET score = '" + score + "' WHERE id = " + id, function (err, result, fields) {
                if (err) throw err;
                console.log(result);

                connection.end();
            });
        });
    },

    //updates a users percentage in the scores table
    updateScore(id, percentage) {
        var connection = makeConnection()

        //make connection

        connection.connect(function (err) {
            if (err) throw err;
            connection.query("UPDATE scores SET percentage = '" + percentage + "' WHERE id = " + id, function (err, result, fields) {
                if (err) throw err;
                console.log(result);

                connection.end();
            });
        });
    },


    deleteScore (scoreId){
        var connection = makeConnection()

        //make connection

        connection.connect(function (err) {
            if (err) throw err;
            connection.query("delete from scores where scoreId =" + scoreId, function (err, result, fields) {
                if (err) throw err;
                console.log(result);

                connection.end();
            });
        });
    },
    deleteUser(userId){
        var connection = makeConnection()

        //make connection

        connection.connect(function (err) {
            if (err) throw err;
            connection.query("delete from users where userId =" + userId, function (err, result, fields) {
                if (err) throw err;
                console.log(result);

                connection.end();
            });
        });
    },
    getScores(){
        var connection = makeConnection()

        //make connection

        connection.connect(function (err) {
            if (err) throw err;
            connection.query("select * from scores", function (err, result, fields) {
                if (err) throw err;
                console.log(result);

                connection.end();
                return result
            });
        });

    }
}