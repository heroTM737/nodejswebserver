var fs = require('fs');
var db = require('../../database/db');
var constants = require('../../constants');

var connected_user = {};
var match = {};

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
                if (status == constants.status.Successful) {
                    console.log(username + " socket = " + connected_user[username]);
                    if (connected_user[username]) {
                        if (connected_user[username] == socket.id) {
                            socket.emit("login", constants.status.Successful);
                        } else {
                            socket.emit("login", constants.status.Failed);
                        }
                    } else {
                        connected_user[username] = socket.id;
                        socket.emit("login", status);
                    }
                } else {
                    socket.emit("login", status);
                }
                
            });
        });

        socket.on('find match', function(data) {
            var users = [];
            for (var key in connected_user) {
                users.push(key + " --- " + connected_user[key]);
            }

            socket.emit("find match", {
                users: users
            });
        });

        socket.on('request match', function(data) {
            if (connected_user[data.username] == socket.id) {
                var currentdate = new Date();
                var match_id = currentdate.getTime() + "_" + Math.floor(Math.random() * 10000);
                match[match_id] = {
                    player1: data.username,
                    player2: data.target
                }

                console.log("request match p1=" + data.username + " p2=" + data.target);

                io.to(connected_user[data.target]).emit('request match', {
                    player1: data.username,
                    match_id: match_id
                });
            }
        });

        socket.on('accept match', function(data) {
            if (connected_user[data.username] == socket.id) {
                console.log("accept match p1=" + data.player1 + " p2=" + data.player2);

                io.sockets.connected[connected_user[data.player1]].join(data.match_id);
                io.sockets.connected[connected_user[data.player2]].join(data.match_id);
            }
        });

        socket.on('chat message', function(data) {
            console.log("recieved = " + data.message);
            io.emit('chat message', {
                username: data.username,
                message: data.message
            });
        });

        socket.on('match turn', function(data) {
            console.log("match turn x=" + data.x + " y=" + data.y);
            io.to(data.match_id).emit('match turn', {
                x: data.x,
                y: data.y
            });

            io.to(data.match_id).emit('chat message', {
                username: data.username,
                message: "x=" + data.x + " y=" + data.y
            });
        })
    });
};