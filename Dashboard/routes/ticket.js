var express = require('express');
var router = express.Router();
var log = require('../config/log')(module);
var TicketModel = require('../models/ticket');
var user = require('../config/roles');

router.get('/dashboard', user.can('user'), function(req, res) {
	return TicketModel.find({},function(err, tickets) {
		if(!err) {
			return res.render('dashboard', {Model: tickets});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return res.send('error', {error: 'Server error'});
		}
	});
});

router.get('/ticket', user.can('user'), function(req, res) {
	return res.render('ticket');
});

router.post('/ticket', user.can('user'), function(req, res) {
	var ticket = new TicketModel({
		name: req.body.name,
		description: req.body.description
	});

	ticket.save(function(err) {
		if(!err) {
			log.info("ticket created");
			return res.redirect('/ticket/' + ticket.id);
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

router.get('/tickets/:id', user.can('user'), function(req, res) {
	return TicketModel.findById(req.params.id, function(err, ticket) {
		if(!ticket) {
			res.statusCode = 404;
			return res.send('error', {error: 'Server error 404'});
		}
		if(!err) {
			return res.render('ticket', {Model: ticket});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return res.send('error', {error: 'Server error'});
		}
	});
});

router.put('/tickets/:id', user.can('user'), function(req, res) {
	return TicketModel.findById(req.params.id, function(err, ticket) {
		if(!ticket) {
			res.statusCode = 404;
			return res.send('error', {error: 'Not found'});
		}

		ticket.name = req.body.name;
		ticket.description = req.body.description;

		return ticket.save(function(err) {
			if(!err) {
				log.info("article updated");
				return res.redirect('/ticket/' + ticket.id);
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

router.delete('/tickets/:id', user.can('user'), function(req, res) {
	return TicketModel.findById(req.params.id, function(err, ticket) {
		if(!ticket) {
			res.statusCode = 404;
			return res.send('error', {error: 'Not found'});
		}
		return ticket.remove(function(err) {
			if(!err) {
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
