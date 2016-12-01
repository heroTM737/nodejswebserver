var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var gameController = require('./controller/game/gameController');

var app = express();
var port = process.env.PORT || 7000;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

//public folder
app.use('/assets', express.static(__dirname + '/public'));

//home page 
app.get('/', function(rep, res) {
    fs.readFile(__dirname + "/views/app.html", 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        res.end(data);
    });
});

//log in
app.post('/login', urlencodedParser, function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    res.send("Successful - " + username);
});

//set up controller
gameController(app);

//start server
app.listen(port, function () {
  console.log('Server ready');
});