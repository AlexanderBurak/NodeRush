var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        name: { type: String, required: true },
		description :String,
		date: { type: Date, default: Date.now },
		statuses: [ {type : mongoose.Schema.ObjectId, ref : 'Status'} ],
		priorities: [ {type : mongoose.Schema.ObjectId, ref : 'Priority'} ]
    }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', userSchema);