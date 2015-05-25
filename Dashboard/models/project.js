var mongoose = require('mongoose');
var Schema = mongoose.Schema;



// define the schema for our user model
var ProjectSchema = new mongoose.Schema({

    name: {type: String, required: true},
    description: String,
    date: {type: Date, default: Date.now},
    statuses: [{type:Schema.Types.ObjectId, ref: 'Status'}],
    priorities: [{type: Schema.Types.ObjectId, ref: 'Priority'}],
    tickets: [{type: Schema.Types.ObjectId, ref: 'Ticket'}],
    users: [{type:Schema.Types.ObjectId, ref: 'User'}],
    _user: {type: Schema.Types.ObjectId, ref: 'User'}
});

var deepPopulate = require('mongoose-deep-populate');
ProjectSchema.plugin(deepPopulate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', ProjectSchema);