var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        name: { type: String, required: true },
		date: { type: Date, default: Date.now },
		tickets: [{type: mongoose.Schema.ObjectId, ref: 'Ticket'}]
    }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Priority', userSchema);