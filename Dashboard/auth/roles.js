var ConnectRoles = require('connect-roles');

var user = new ConnectRoles({
	failureHandler: function (req, res, action) {
		var accept = req.headers.accept || '';
		res.status(403);
		if (~accept.indexOf('html')) {
			res.render('access-denied', {action: action});
		} else {
			return res.redirect('/login/');
		}
	}
});

user.use('auth', function (req) {
	if(req.isAuthenticated()) {
		return true;
	}
});

user.use('admin', function (req) {
	if(req.user && req.user.roleName === 'administrator') {
		return true;
	}
});

user.use('user', function (req) {
	if(req.user && req.user.roleName === 'user') {
		return true;
	}
});

module.exports = user;