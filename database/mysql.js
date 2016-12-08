var mysql = require('mysql');
var constants = require('../constants');

var dbConfig = {
    host     : '128.88.242.47',
    user     : 'tien',
    password : 'tien',
    database : 'arcsightodc'
}

function verifyUser(username, password, callback) {
    var connection = mysql.createConnection(dbConfig);

    connection.connect();

    var query = 'SELECT * from user where username = "' + username + '" AND password = "' + password + '"';
    
    connection.query(query, function(err, rows, fields) {
        if (err) throw err;

        if (rows.length > 0) {
            callback(constants.status.Successful);
        } else {
            callback(constants.status.Failed);
        }
    });

    connection.end();
}

module.exports = {
    verifyUser: verifyUser
}