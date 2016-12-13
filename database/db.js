var mongodb = require('./mongodb');
var mysql = require('./mysql');
var localhost = require('./localhost');

var dbInstance = mongodb;
if (localhost.local_ip_v4 == "128.88.242.23") {
    dbInstance = mysql;
}

function verifyUser(username, password, callback) {
    dbInstance.verifyUser(username, password, callback);
}

module.exports = {
    verifyUser: verifyUser
}