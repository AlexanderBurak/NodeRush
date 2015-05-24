var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// define the schema for our user model
var TicketSchema = new mongoose.Schema({

	name: {type: String, required: true},
	description: String,
	date: {type: Date, default: Date.now},
	_status: {type: Schema.Types.ObjectId, ref: 'Status'},
	_priority: {type: String, required: true},
    _project: {type: Schema.Types.ObjectId, ref: 'Project'},
    _user:{type: Schema.Types.ObjectId, ref: 'User'}


});

// create the model for users and expose it to our app
module.exports = mongoose.model('Ticket', TicketSchema);