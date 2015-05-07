module.exports = function(app, passport) {


	app.get('/dashboard', isLoggedIn, function(req, res) {
		res.render('profile.html', {
			user: req.user // get the user out of session and pass to template
		});
	});


	app.get('/projectboard', isLoggedIn, function(req, res) {
		res.render('profile.html', {
			user: req.user // get the user out of session and pass to template
		});
	});

	app.get('/project', isLoggedIn, function(req, res) {
		res.render('profile.html', {
			user: req.user // get the user out of session and pass to template
		});
	});


	app.get('/ticket', isLoggedIn, function(req, res) {
		res.render('profile.html', {
			user: req.user // get the user out of session and pass to template
		});
	});


	// route middleware to make sure
	function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on
		if(req.isAuthenticated())
			return next();

		// if they aren't redirect them to the home page
		res.redirect('/');
	}
}