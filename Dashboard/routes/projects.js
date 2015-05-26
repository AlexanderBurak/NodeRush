var express = require('express');
var router = express.Router();
var log = require('../utils/log')(module);
var ProjectModel = require('../models/project');
var StatusModel = require('../models/status');
var PriorityModel = require('../models/priority');
var TicketModel = require('../models/ticket');
var UserModel = require('../models/user');
var user = require('../auth/roles');

router.get('/projects', user.can('user'), function(req, res) {
	return ProjectModel.find({}, function(err, projects) {
		if(!err) {
			return res.render('projects', {Model: projects});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return res.send('error', {error: 'Server error'});
		}
	});

});


router.get('/dashboard/:id', user.can('user'), function(req, res) {
	return ProjectModel.findById(req.params.id).deepPopulate('statuses  priorities tickets._user').exec(function(err, project) {
		if(!err) {
			UserModel.find({}, function(err, users) {
				if(!err) {
					project.users = users;
					return res.render('dashboard', {Model: project});
				}
			});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return res.send('error', {error: 'Server error'});
		}
	});
});


router.get('/project', user.can('user'), function(req, res) {
	return res.render('project');
});

router.post('/project', user.can('user'), function(req, res) {
	var project = new ProjectModel({
		name: req.body.name,
		description: req.body.description,
		_user: req.user.id
	});

	project.save(function(err) {
		if(!err) {
			log.info("project created");
			return res.redirect('/projects/' + project.id);
		} else {
			console.log(err);
			if(err.name == 'ValidationError') {
				req.flash('validationError', 'Oops! Wrong data. Please enter valid data');
			} else {
				res.statusCode = 500;
				res.send('error', {error: 'Server error'});
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	});
});

router.get('/projects/:id', user.can('user'), function(req, res) {

	return ProjectModel.findById(req.params.id).populate('statuses priorities').exec(function(err, project) {
		if(!project) {
			res.statusCode = 404;
			return res.send('error', {error: 'Server  error 404'});
		}
		if(!err) {
			return res.render('project', {Model: project});
		}
		else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return res.send('error', {error: 'Server error'});
		}
	});
});

router.post('/projects/:id', user.can('user'), function(req, res) {
	return ProjectModel.findById(req.params.id, function(err, project) {
		if(!project) {
			res.statusCode = 404;
			return res.send('error', {error: 'Not found'});
		}

		project.name = req.body.name;
		project.description = req.body.description;

		return project.save(function(err) {
			if(!err) {
				log.info("article updated");
				return res.redirect('/projects/');
			} else {
				if(err.name == 'ValidationError') {
					req.flash('validationError', 'Oops! Wrong data. Please enter valid data');
				} else {
					res.statusCode = 500;
					res.send('error', {error: 'Server error'});
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	});
});

router.get('/removeProject/:id', user.can('user'), function(req, res) {
	return ProjectModel.findById(req.params.id, function(err, project) {
		if(!project) {
			res.statusCode = 404;
			return res.send('error', {error: 'Not found'});
		}
		return project.remove(function(err) {
			if(!err) {
				log.info("article removed");
				return res.redirect('/projects/');
			} else {
				res.statusCode = 500;
				log.error('Internal error(%d): %s', res.statusCode, err.message);
				return res.send('error', {error: 'Server error'});
			}
		});
	});
});


router.post('/status/:id', user.can('user'), function(req, res) {
	var status = new StatusModel({
		name: req.body.statusName,
		_project: req.params.id
	});


	status.save(function(err) {
		if(!err) {
			log.info("status created");
			ProjectModel.findById(req.params.id, function(err, project) {
				project.statuses.push(status);
				return project.save(function(err) {
					if(!err) {
						log.info("project priorities updated");
						return res.redirect('/projects/' + req.params.id);
					}
				});
			});
		} else {
			console.log(err);
			if(err.name == 'ValidationError') {
				req.flash('validationError', 'Oops! Wrong data. Please enter valid data');
			} else {
				res.statusCode = 500;
				res.send('error', {error: 'Server error'});
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	});
});

router.post('/statuses/:id', user.can('user'), function(req, res) {
	return StatusModel.findById(req.params.id, function(err, status) {
		if(!status) {
			res.statusCode = 404;
			return res.send('error', {error: 'Not found'});
		}
		var project = status._project;
		return status.remove(function(err) {
			if(!err) {
				log.info("article removed");
				return res.redirect('/projects/' + project);
			} else {
				res.statusCode = 500;
				log.error('Internal error(%d): %s', res.statusCode, err.message);
				return res.send('error', {error: 'Server error'});
			}
		});
	});
});

router.post('/priority/:id', user.can('user'), function(req, res) {
	var priority = new PriorityModel({
		name: req.body.priorityName,
		_project: req.params.id
	});

	priority.save(function(err) {
		if(!err) {
			log.info("priority created");
			ProjectModel.findById(req.params.id, function(err, project) {
				project.priorities.push(priority);
				return project.save(function(err) {
					if(!err) {
						log.info("project priorities updated");
						return res.redirect('/projects/' + req.params.id);
					}
				});
			});
		} else {
			console.log(err);
			if(err.name == 'ValidationError') {
				req.flash('validationError', 'Oops! Wrong data. Please enter valid data');
			} else {
				res.statusCode = 500;
				res.send('error', {error: 'Server error'});
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	});
});

router.post('/priorities/:id', user.can('user'), function(req, res) {

	return PriorityModel.findById(req.params.id, function(err, priority) {
		if(!priority) {
			res.statusCode = 404;
			return res.send('error', {error: 'Not found'});
		}

		var project = priority._project;
		return priority.remove(function(err) {
			if(!err) {
				log.info("article removed");
				return res.redirect('/projects/' + project);
			} else {
				res.statusCode = 500;
				log.error('Internal error(%d): %s', res.statusCode, err.message);
				return res.send('error', {error: 'Server error'});
			}
		});
	});
});

module.exports = router;
