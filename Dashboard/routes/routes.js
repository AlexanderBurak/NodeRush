var user = require('../auth/roles');
var express = require('express');
var router = express.Router();
var log = require('../utils/log')(module);
var passport = require('passport');
var UserModel = require('../models/user');

// HOME PAGE (with login links)
router.get('/', function(req, res) {
	res.render('index.html');
});

// LOGIN
router.get('/login', function(req, res) {
	// render the page and pass in any flash data if it exists
	res.render('login.html', {message: req.flash('loginMessage')});
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/projects',
	failureRedirect: '/login', // redirect back to the signup page if there is an error
	failureFlash: true // allow flash messages
}));

// SIGNUP
router.get('/signup', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('signup.html', {message: req.flash('signupMessage')});
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/projects', // redirect to the secure profile section
	failureRedirect: '/signup', // redirect back to the signup page if there is an error
	failureFlash: true // allow flash messages
}));


// PROFILE SECTION
router.get('/profile', user.can('user'), function(req, res) {
	return UserModel.findById(req.user.id, function(err, user) {
		if(!user) {
			res.statusCode = 404;
			return res.send('error', {error: 'Server error 404'});
		}
		if(!err) {
			return res.render('profile', {Model: user});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return res.send('error', {error: 'Server error'});
		}
	});
});

// LOGOUT
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});


module.exports = router;

