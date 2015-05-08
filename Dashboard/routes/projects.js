var express = require('express');
var router = express.Router();
var log = require('./config/log')(module);
var ProjectModel = require('./model/project');
var user = require('./config/roles');

router.get('/projects', user.can('user'), function(req, res) {
	return ProjectModel.find(function(err, projects) {
		if(!err) {
			return res.render('projects', {Model: ProjectModel});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return res.send('error', {error: 'Server error'});
		}
	});
});

router.post('/projects', user.can('user'), function(req, res) {
	var project = new ProjectModel({
		name: req.body.name,
		description: req.body.description
	});

	project.save(function(err) {
		if(!err) {
			log.info("project created");
			return res.redirect('/project/' + ProjectModel.projectId);
		} else {
			console.log(err);
			if(err.name == 'ValidationError') {
				res.statusCode = 400;
				res.send('error', {error: 'Validation error'});
			} else {
				res.statusCode = 500;
				res.send('error', {error: 'Server error'});
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	});
});

router.get('/projects/:id', user.can('user'), function(req, res) {
	return ProjectModel.findById(req.params.id, function(err, project) {
		if(!project) {
			res.statusCode = 404;
			return res.send('error', {error: 'Server error 404'});
		}
		if(!err) {
			return res.render('project', {Model: ProjectModel});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return res.send('error', {error: 'Server error'});
		}
	});
});

router.put('/projects/:id', user.can('user'), function(req, res) {
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
				return res.redirect('/project/' + ProjectModel.projectId);
			} else {
				if(err.name == 'ValidationError') {
					res.statusCode = 400;
					res.send('error', {error: 'Validation error'});
				} else {
					res.statusCode = 500;
					res.send('error', {error: 'Server error'});
				}
				log.error('Internal error(%d): %s', res.statusCode, err.message);
			}
		});
	});
});

router.delete('/projects/:id', user.can('user'), function(req, res) {
	return ProjectModel.findById(req.params.id, function(err, project) {
		if(!project) {
			res.statusCode = 404;
			return res.send('error', {error: 'Not found'});
		}
		return project.remove(function(err) {
			if(!err) {
				log.info("article removed");
				return res.redirect('/projects/' + ProjectModel.projectId);
			} else {
				res.statusCode = 500;
				log.error('Internal error(%d): %s', res.statusCode, err.message);
				return res.send('error', {error: 'Server error'});
			}
		});
	});
});

module.exports = router;
