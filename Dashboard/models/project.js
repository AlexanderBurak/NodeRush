var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    name: {type: String, required: true},
    description: String,
    date: {type: Date, default: Date.now},
    status: [{type: mongoose.Schema.ObjectId, ref: 'Status'}],
    priorities: [{type: mongoose.Schema.ObjectId, ref: 'Priority'}],
    tickets: [{type: mongoose.Schema.ObjectId, ref: 'Ticket'}],
    userId: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', userSchema);