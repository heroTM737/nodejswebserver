var fs = require('fs');

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

        socket.on('chat message', function(data) {
            var username = data.username;
            var password = data.password;
            io.emit('chat message', username + " - " + password);
        });

        socket.on('login', function(data) {
            var username = data.username;
            var password = data.password;
            io.emit('chat message', username + " - " + password);
        });
    });
};