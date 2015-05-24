var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// define the schema for our user model
var StatusSchema = new  mongoose.Schema({

    name: {type: String, required: true},
    date: {type: Date, default: Date.now},
    _project: {type: Schema.Types.ObjectId, ref: 'Project'},
    tickets: [{type: Schema.Types.ObjectId, ref: 'Ticket'}]

});

module.exports = mongoose.model('Status', StatusSchema);