var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    name: {type: String, required: true},
    date: {type: Date, default: Date.now},
    project: {type: mongoose.Schema.ObjectId, ref: 'Project'},
    tickets: [{type: mongoose.Schema.ObjectId, ref: 'Ticket'}]

});

module.exports = mongoose.model('Status', userSchema);