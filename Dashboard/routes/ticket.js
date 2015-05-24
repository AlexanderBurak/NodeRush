var express = require('express');
var router = express.Router();
var log = require('../config/log')(module);
var TicketModel = require('../models/ticket');
var ProjectModel = require('../models/project');
var UserModel = require('../models/user');
var user = require('../config/roles');


router.get('/ticket/:id', user.can('user'), function (req, res) {

    return ProjectModel.findById(req.params.id).populate('statuses priorities').exec(function (err, project) {
        if (!project) {
            res.statusCode = 404;
            return res.send('error', {error: 'Server  error 404'});
        }
        if (!err) {

            UserModel.find({}, function (err, users) {
                if (!err) {
                    project.users = users;
                    return res.render('ticket', {Model: project});
                }
            });
        }
        else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send('error', {error: 'Server error'});
        }
    });
});

router.post('/ticket/:id', user.can('user'), function (req, res) {
    var ticket = new TicketModel({
        name: req.body.name,
        description: req.body.description,
        _status: req.body.status,
        _priority: req.body.priority

    });

    ticket.save(function (err) {
        if (!err) {
            log.info("ticket created");

            ProjectModel.findById(req.params.id, function (err, project) {
                project.tickets.push(ticket);
                return project.save(function (err) {
                    if (!err) {
                        log.info("project tickets updated");
                        return res.redirect('/dashboard/' + req.params.id);
                    }
                });
            });

        } else {
            console.log(err);
            if (err.name == 'ValidationError') {
                req.flash('validationError', 'Oops! Wrong data. Please enter valid data');
            } else {
                res.statusCode = 500;
                res.send('error', {error: 'Server error'});
            }
            log.error('Internal error(%d): %s', res.statusCode, err.message);
        }
    });
});

router.get('/tickets/:id', user.can('user'), function (req, res) {
    return TicketModel.findById(req.params.id, function (err, ticket) {
        if (!ticket) {
            res.statusCode = 404;
            return res.send('error', {error: 'Server error 404'});
        }
        if (!err) {

            ProjectModel.findById(req.params.id).populate('statuses priorities').exec(function (err, project) {
                if (!project) {
                    res.statusCode = 404;
                    return res.send('error', {error: 'Server  error 404'});
                }
                if (!err) {

                    UserModel.find({}, function (err, users) {
                        if (!err) {
                            project.users = users;
                            project.tickets = [];
                            project.tickets.push(ticket);
                            return res.render('ticket', {Model: project});
                        }
                    });
                }
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send('error', {error: 'Server error'});
        }
    });
});

router.put('/tickets/:id', user.can('user'), function (req, res) {
    return TicketModel.findById(req.params.id, function (err, ticket) {
        if (!ticket) {
            res.statusCode = 404;
            return res.send('error', {error: 'Not found'});
        }

        ticket.name = req.body.name;
        ticket.description = req.body.description;

        return ticket.save(function (err) {
            if (!err) {
                log.info("article updated");
                return res.redirect('/ticket/' + ticket.id);
            } else {
                if (err.name == 'ValidationError') {
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

router.delete('/tickets/:id', user.can('user'), function (req, res) {
    return TicketModel.findById(req.params.id, function (err, ticket) {
        if (!ticket) {
            res.statusCode = 404;
            return res.send('error', {error: 'Not found'});
        }
        return ticket.remove(function (err) {
            if (!err) {
                log.info("article removed");
                return res.redirect('/dashboard');
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send('error', {error: 'Server error'});
            }
        });
    });
});

module.exports = router;
