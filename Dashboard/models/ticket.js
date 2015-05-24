var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

	name: {type: String, required: true},
	description: String,
	date: {type: Date, default: Date.now},
	status: {type: mongoose.Schema.ObjectId, ref: 'Status'},
	priority: {type: String, required: true},
    project: {type: mongoose.Schema.ObjectId, ref: 'Project'},
    user:{type: mongoose.Schema.ObjectId, ref: 'User'}


});

// create the model for users and expose it to our app
module.exports = mongoose.model('Ticket', userSchema);