module.exports = function(app) {
    app.get('/game/caro', function(rep, res) {
        res.send('caro');
    });
};