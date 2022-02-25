var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'db-mysql-lon1-92192-do-user-10957123-0.b.db.ondigitalocean.com',
  port     : '25060',
  user     : 'doadmin',
  password : 'MBAeLg2tttYUGn2Z',
  database : 'defaultdb'
});
 
function selectUID(){
  connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
  
  connection.end();
}