const res = require('express/lib/response');
var mysql      = require('mysql2');
var fs = require('fs')


function makeConnection(){
  var connection = mysql.createConnection({
    host     : 'db-mysql-lon1-72184-do-user-10942530-0.b.db.ondigitalocean.com',
    port     : '25060',
    user     : 'doadmin',
    password : 'R45mUKjM0QGNmejm',
    database: 'defaultdb',
    ssl      : {
      ca : fs.readFileSync('./ca-certificate.crt')
    }
  });
}


//selects the given users score
module.exports = {

  //selecting user points
  selectUsersPoints: function(id){
  
    makeConnection()
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
  

    makeConnection()
  

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
 


    makeConnection()

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
    var mysql      = require('mysql2');
    var fs = require('fs')
    makeConnection()
    
  


      connection.query("SELECT users.name,scores.scores from scores inner join users on scores.id = users.id order by scores.scores desc", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send({"top5":result})
        
     
        connection.end();
        return result
      });
  }
}



