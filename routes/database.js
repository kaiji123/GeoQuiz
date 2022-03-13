const res = require('express/lib/response');
var mysql      = require('mysql2');

function makeConnection(){
   
  var connection = mysql.createConnection({
    host     : `${process.env.HOSTNAME}`,
    port     : `${process.env.DBPORT}`,
    user     : `${process.env.DBUSER}`,
    password : `${process.env.DBPASSWORD}`,
    database: `${process.env.DBDATABASE}`
  
  });
  return connection
}

//selects the given users score
module.exports = {

  //selecting user points
  selectUsersPoints: function(id){
    //make connection
    var connection = makeConnection()
    connection.connect(function(err) {
      if (err) throw err;
      connection.query("SELECT scores FROM scores WHERE id =" + id, function (err, result, fields) {
        if (err) throw err;
        console.log(result);

        connection.end();
      });
    });
  },
  //adds user to the users table
  addUser: function(userid, name){
  

    var connection = makeConnection()
  
    //make connection

    connection.connect(function(err) {
      if (err) throw err;
      connection.query("INSERT INTO users(id, name) VALUES ("+ userid + ", '"+ name + "')", function (err, result, fields) {
        if (err) throw err;
        console.log(result);

        connection.end();
      });
    });
  },


  //this is get users function to get all users
  getUsers: function(){
 

    //make connection 
    var connection = makeConnection()

    connection.connect(function(err) {
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
  getTop5: function(req,res){
    // use makeConnection to make a connection to database , please assign it to connection variable
    var connection = makeConnection()
  


      connection.query("SELECT users.name,scores.scores from scores inner join users on scores.id = users.id order by scores.scores desc limit 5", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send({"top5":result})
        
     
        connection.end();
        return result
      });
  },

  getLeaderboard: function(req,res){
    var connection = makeConnection()
    connection.query("SELECT users.name,scores.scores from scores inner join users on scores.id = users.id order by scores.scores desc", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.send({"top5":result})
      
   
      connection.end();
      return result
    });
  },

  addScore(id, score, percentage){
    var connection = makeConnection()
  
    //make connection

    connection.connect(function(err) {
      if (err) throw err;
      connection.query("INSERT INTO scores(id, scores, percentage) VALUES ("+ id + ", '"+ score +", '"+percentage +"')", function (err, result, fields) {
        if (err) throw err;
        console.log(result);

        connection.end();
      });
    });
  }
}



