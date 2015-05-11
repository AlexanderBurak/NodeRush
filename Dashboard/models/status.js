var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

	name: {type: String, required: true},
	date: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Status', userSchema);