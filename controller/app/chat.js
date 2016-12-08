var fs = require('fs');
var db = require('../../database/db');
var constants = require('../../constants');

module.exports = function(app, io, __rootdirname) {
    app.get('/app/chat', function(rep, res) {
        fs.readFile(__rootdirname + "/views/chat.html", 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            res.end(data);
        });
    });

    io.on('connection', function(socket) {
        console.log('a user connected');

        socket.on('disconnect', function() {
            console.log('user disconnected');
            io.emit('chat message', socket.id + " disconnected");
        });

        socket.on('login', function(data) {
            var username = data.username;
            var password = data.password;

            console.log(username + " is logging in using socket");
            db.verifyUser(username, password, function(status) {
                console.log(username + " status = " + status);
                socket.emit("login", status);
            });
        });

        socket.on('chat message', function(data) {
            console.log("recieved = " + data.message);
            io.emit('chat message', {
                username: data.username,
                message: data.message
            });
        });

        socket.on('match turn', function(data) {
            console.log("match turn x="+data.x);
            io.emit('match turn', {
                x: data.x,
                y: data.y
            });

            io.emit('chat message', {
                username: data.username,
                message: "x=" + data.x + " y=" + data.y
            });
        })
    });
};