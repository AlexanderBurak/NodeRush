module.exports = function(app, passport) {
    app.get('/projects', function(req, res) {
        res.send('This is not implemented now');
    });

    app.post('/projects', function(req, res) {
        res.send('This is not implemented now');
    });

    app.get('/projects/:id', function(req, res) {
        res.send('This is not implemented now');
    });

    app.put('/projects/:id', function (req, res){
        res.send('This is not implemented now');
    });

    app.delete('/projects/:id', function (req, res){
        res.send('This is not implemented now');
    });

}