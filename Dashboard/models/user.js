var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// define the schema for our user model
var userSchema = new mongoose.Schema({

	firstName: {type: String, required: true},
	lastName: {type: String},
	email: {type: String, required: true},
	password: {type: String, required: true},
	salt: {type: String},
	date: {type: Date, default: Date.now},
	roleName: {type: String, default: 'user'},
    tickets: [{type: Schema.Types.ObjectId, ref: 'Ticket'}]

});

// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);