var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our user model
var PrioritySchema = new mongoose.Schema({

    name: {type: String, required: true},
    date: {type: Date, default: Date.now},
    color: {type: String, required: false},
    _project: {type: Schema.Types.ObjectId, ref: 'Project'}

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Priority', PrioritySchema);