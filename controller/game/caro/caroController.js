module.exports = function(app) {
    app.get('/game/caro', function(rep, res) {
        res.send('caro');
    });

    app.post('/game/caro/turn', function(rep, res) {
        var username = req.body.username;
        var time = req.body.time;
        var x = req.body.x;
        var y = req.body.y;

        if (req.session.username == username) {
            //check time is not expired

            //save turn
        } else {
            res.end('Failed');
        }
        
    });
};