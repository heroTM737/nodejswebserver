var mongodb = require('mongodb');
var constants = require('../constants');

var uri = 'mongodb://tientm:tientm@ds119618.mlab.com:19618/tientmmongo';

function verifyUser(username, password, callback) {
    mongodb.MongoClient.connect(uri, function(err, db) {
        if (err) throw err;

        var user = db.collection('user');

        console.log("finding username = " + username);
        console.log("finding password = " + password);

        var query = {
            username: username,
            password: password
        }
        
        user.findOne(query, {}, function (err, doc) {
            if (err) throw err;
            
            console.log(doc);
            if (doc) {
                callback(constants.status.Successful);
            } else {
                callback(constants.status.Failed);
            }

            db.close();
        });
    });
}

module.exports = {
    verifyUser: verifyUser
}