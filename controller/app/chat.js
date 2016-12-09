var fs = require('fs');
var db = require('../../database/db');
var constants = require('../../constants');

var connected_user = {};
var connected_socket = {};
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

    var updateOnlineUsers = function() {
        var users = [];
        for (var key in connected_user) {
            if (connected_user[key]) {
                users.push(key + " --- " + connected_user[key]);
            }
        }

        io.emit("find match", {
            users: users
        });
    }

    io.on('connection', function(socket) {
        console.log('a user connected');

        socket.on('disconnect', function() {
            if (connected_socket[socket.id]) {
                var username = connected_socket[socket.id];
                connected_socket[socket.id] = null;
                connected_user[username] = null;

                console.log(username + ' disconnected');
                updateOnlineUsers();
            }
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
                        connected_socket[socket.id] = username;
                        socket.emit("login", status);
                        updateOnlineUsers();
                    }
                } else {
                    socket.emit("login", status);
                }
                
            });
        });

        socket.on('logout', function(data) {
            var username = connected_socket[socket.id];
            connected_user[username] = null;
            connected_socket[socket.id] = null;
            socket.emit("logout", constants.status.Successful);
            console.log(username + " logged out");
            updateOnlineUsers();
        });

        socket.on('find match', function(data) {
            updateOnlineUsers();
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

                io.to(data.match_id).emit("accept match");
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
            socket_session = connected_socket[socket.id];
            var match_id = socket_session.match_id;
            var username = socket_session.username;
            var mark = match[match_id].player1 == username ? "x" : "o";

            console.log(username + " turn x=" + data.x + " y=" + data.y);

            io.to(match_id).emit('match turn', {
                x: data.x,
                y: data.y,
                mark: mark
            });
        })
    });
};