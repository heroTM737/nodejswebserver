var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var db = require('./database/db');
var session = require('express-session');
var gameController = require('./controller/game');
var appController = require('./controller/app');
var constants = require('./constants');

var test = require('./test/mongodb');

var port = process.env.PORT || 7000;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

//public folder
app.use('/assets', express.static(__dirname + '/public'));

//session
app.use(session({
  secret: 'tientmSecretSession',
  resave: false,
  saveUninitialized: true
}))

//home page
app.get('/', function(req, res) {
    res.end("Home page");
});

//user page
app.get('/user', function(req, res) {
    console.log("session username = " + req.session.username);
    if (req.session.username) {
        res.end(req.session.username + " page");
    } else {
        res.redirect("/login");
    }
});

//authenticate 
app.get('/login', function(req, res) {
    fs.readFile(__dirname + "/views/login.html", 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        res.end(data);
    });
});


app.post('/login', urlencodedParser, function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    console.log(username + " is logging in");
    db.verifyUser(username, password, function(status) {
        if (status == constants.status.Successful) {
            req.session.username = username;
        }
        
        if (req.body.url) {
            res.redirect(req.body.url);
        } else {
            res.end(status);
        }
    });
});

app.post('/logout', function(req, res) {
     req.session.username = null;
     res.redirect("/login");
});

//test
app.get('/test', urlencodedParser, function(req, res) {
    test();
    
    res.send("Successful");
});

//set up controller
gameController(app);
appController(app, io, __dirname);

//start server
http.listen(port, function () {
  console.log('Server ready at port ' + port);
});