var chatController = require('./chat');

module.exports = function(app, io, __rootdirname) {
    chatController(app, io, __rootdirname);
};