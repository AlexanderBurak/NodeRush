var express = require('express');
var router = express.Router();
var log = require('../config/log')(module);
var ProjectModel = require('../models/project');
var StatusModel = require('../models/status');
var PriorityModel = require('../models/priority');
var user = require('../config/roles');

router.get('/projects', user.can('user'), function (req, res) {
    return ProjectModel.find({}, function (err, projects) {
        if (!err) {
            return res.render('projects', {Model: projects});
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send('error', {error: 'Server error'});
        }
    });

});


router.get('/dashboard/:id', user.can('user'), function (req, res) {
    return ProjectModel.find(req.params.id).populate('Status').populate('Ticket')
        .populate('Priority').exec(function (err, project) {
            if (!err) {
                return res.render('dashboard', {Model: project});
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send('error', {error: 'Server error'});
            }
        });
});


router.get('/project', user.can('user'), function (req, res) {
    return res.render('project');
});

router.post('/project', user.can('user'), function (req, res) {
    var project = new ProjectModel({
        name: req.body.name,
        description: req.body.description
    });

    project.save(function (err) {
        if (!err) {
            log.info("project created");
            return res.redirect('/projects/' + project.id);
        } else {
            console.log(err);
            if (err.name == 'ValidationError') {
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

router.get('/projects/:id', user.can('user'), function (req, res) {
    return ProjectModel.findById(req.params.id, function (err, project) {
        if (!project) {
            res.statusCode = 404;
            return res.send('error', {error: 'Server error 404'});
        }
        if (!err) {
            return res.render('project', {Model: project});
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send('error', {error: 'Server error'});
        }
    });
});

router.put('/projects/:id', user.can('user'), function (req, res) {
    return ProjectModel.findById(req.params.id, function (err, project) {
        if (!project) {
            res.statusCode = 404;
            return res.send('error', {error: 'Not found'});
        }

        project.name = req.body.name;
        project.description = req.body.description;

        return project.save(function (err) {
            if (!err) {
                log.info("article updated");
                return res.redirect('/project/' + ProjectModel.projectId);
            } else {
                if (err.name == 'ValidationError') {
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

router.delete('/projects/:id', user.can('user'), function (req, res) {
    return ProjectModel.findById(req.params.id, function (err, project) {
        if (!project) {
            res.statusCode = 404;
            return res.send('error', {error: 'Not found'});
        }
        return project.remove(function (err) {
            if (!err) {
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



router.post('/status/:id', user.can('user'), function (req, res) {
    var status = new StatusModel({
        name: req.body.name,
        project:req.params.id
    });

    status.save(function (err) {
        if (!err) {
            log.info("status created");
            return res.redirect('/projects/' + req.params.id);
        } else {
            console.log(err);
            if (err.name == 'ValidationError') {
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

router.delete('/statuses/:id', user.can('user'), function (req, res) {
    return StatusModel.findById(req.params.id, function (err, status) {
        if (!status) {
            res.statusCode = 404;
            return res.send('error', {error: 'Not found'});
        }
        return status.remove(function (err) {
            if (!err) {
                log.info("article removed");
                return res.redirect('/projects/' + StatusModel.project);
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send('error', {error: 'Server error'});
            }
        });
    });
});

router.post('/priority/:id', user.can('user'), function (req, res) {
    var priority = new PriorityModel({
        name: req.body.name,
        project:req.params.id
    });

    priority.save(function (err) {
        if (!err) {
            log.info("status created");
            return res.redirect('/projects/' + req.params.id);
        } else {
            console.log(err);
            if (err.name == 'ValidationError') {
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

router.delete('/priorities/:id', user.can('user'), function (req, res) {
    return PriorityModel.findById(req.params.id, function (err, priority) {
        if (!priority) {
            res.statusCode = 404;
            return res.send('error', {error: 'Not found'});
        }
        return priority.remove(function (err) {
            if (!err) {
                log.info("article removed");
                return res.redirect('/projects/' + PriorityModel.project);
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send('error', {error: 'Server error'});
            }
        });
    });
});

module.exports = router;
