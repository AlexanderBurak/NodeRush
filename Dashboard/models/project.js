var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

	name: {type: String, required: true},
	description: String,
	date: {type: Date, default: Date.now},
	status: {type: String, required: false},
	priorities: {type: String, required: false}


});

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', userSchema);