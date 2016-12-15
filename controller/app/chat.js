var fs = require('fs');
var db = require('../../database/db');
var constants = require('../../constants');

var connected_socket = {};
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

    var updateOnlineUsers = function() {
        var users = [];
        for (var key in connected_user) {
            if (connected_user[key]) {
                users.push(key);
            }
        }

        io.emit("find match", {
            users: users
        });
    }

    var getNewMatchID = function() {
        var currentdate = new Date();
        return currentdate.getTime() + "_" + Math.floor(Math.random() * 10000);
    }

    io.on('connection', function(socket) {
        console.log('a user connected');

        socket.on('disconnect', function() {
            if (connected_socket[socket.id]) {
                var username = connected_socket[socket.id].username;
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
                console.log(username + " log in status = " + status);
                if (status == constants.status.Successful) {
                    connected_user[username] = socket.id;
                    connected_socket[socket.id] = {
                        username: username,
                        socket: {
                            id: socket.id
                        }
                    };
                    console.log(username + " socket = " + connected_user[username]);
                    socket.emit("login", status);
                    updateOnlineUsers();
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
            var username = connected_socket[socket.id].username;
            var target = data.target;
            
            var match_id = getNewMatchID();
            while (match[match_id]) {
                match_id = getNewMatchID();
            }
            match[match_id] = {
                player1: username,
                player2: target,
                socket1: socket.id,
                socket2: connected_user[target]
            }

            console.log("requesting match p1=" + username + " p2=" + target);

            io.to(connected_user[target]).emit('request match', {
                source: username,
                match_id: match_id
            });
        });

        socket.on('accept match', function(data) {
            var match_id = data.match_id;
            var player1 = match[match_id].player1;
            var player2 = match[match_id].player2;
            console.log("accept match p1=" + player1 + " p2=" + player2);

            var socket1 = match[match_id].socket1;
            var socket2 = match[match_id].socket2;
            io.sockets.connected[socket1].join(match_id);
            io.sockets.connected[socket2].join(match_id);

            io.to(match_id).emit("accept match",{match_id: match_id});
            io.to(socket1).emit("turn free", {});
            io.to(socket2).emit("turn locked", {});
        });

        socket.on('chat message', function(data) {
            console.log("recieved = " + data.message);
            io.emit('chat message', {
                username: data.username,
                message: data.message
            });
        });

        socket.on('match turn', function(data) {
            var match_id = data.match_id;
            var username = connected_socket[socket.id].username;

            var icon = "x";
            if (match[match_id].socket1 == socket.id) {
                icon = "o";
            }

            console.log(username + " turn x=" + data.x + " y=" + data.y + " icon=" + icon);

            io.to(match_id).emit('match turn', {
                x: data.x,
                y: data.y,
                icon: icon
            });

            if (socket.id == match[match_id].socket1) {
                io.to(match[match_id].socket1).emit("turn locked", {});
                io.to(match[match_id].socket2).emit("turn free", {});
            } else {
                io.to(match[match_id].socket1).emit("turn free", {});
                io.to(match[match_id].socket2).emit("turn locked", {});
            }
        })
    });
};