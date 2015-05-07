module.exports = function(app, passport) {
    app.get('/tickets', function(req, res) {
        res.send('This is not implemented now');
    });

    app.post('/tickets', function(req, res) {
        res.send('This is not implemented now');
    });

    app.get('/tickets/:id', function(req, res) {
        res.send('This is not implemented now');
    });

    app.put('/tickets/:id', function (req, res){
        res.send('This is not implemented now');
    });

    app.delete('/tickets/:id', function (req, res){
        res.send('This is not implemented now');
    });

}