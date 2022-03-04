//selects the given users score
module.exports = {
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
  }
}

//adds user to the users table
module.exports = {
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
  }
}

