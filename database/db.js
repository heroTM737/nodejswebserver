var mongodb = require('./mongodb');
var mysql = require('./mysql');

var dbInstance = mysql;

function verifyUser(username, password, callback) {
    dbInstance.verifyUser(username, password, callback);
}

module.exports = {
    verifyUser: verifyUser
}