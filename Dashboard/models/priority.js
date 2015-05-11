var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

	name: {type: String, required: true},
	date: {type: Date, default: Date.now},
	color: {type: String, required: true}

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Priority', userSchema);