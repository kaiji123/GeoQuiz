const res = require('express/lib/response');

//selects the given users score
module.exports = {

  //selecting user points
  selectUsersPoints: function(id){
    var mysql      = require('mysql2');
    var fs = require('fs')
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
    var mysql      = require('mysql2');
    var fs = require('fs')
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
    var mysql      = require('mysql2');
    var fs = require('fs')

    //make connection to database
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
    var connection = mysql.createConnection({
      host     : 'db-mysql-lon1-72184-do-user-10942530-0.b.db.ondigitalocean.com',
      port     : '25060',
      user     : 'doadmin',
      password : 'R45mUKjM0QGNmejm',
      database: 'defaultdb'
    });

    
  

    connection.connect(async function(err) {
      if (err) throw err;
      connection.query("SELECT users.name,scores.scores from scores inner join users on scores.id = users.id order by scores.scores desc", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result)
        
     
        connection.end();
        return result
      });
    });
  }
}



