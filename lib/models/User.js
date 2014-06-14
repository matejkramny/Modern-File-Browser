var mongoose = require('mongoose')
	, ObjectId = mongoose.Schema.ObjectId;

var crypto = require('crypto');

var schema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

schema.methods.update = function (body, cb) {
	this.name = body.name;
	this.email = body.email;

	if (body.password) {
		this.setPassword(body.password);
	}

	this.save(cb);
}

schema.methods.setPassword = function(password) {
	var shasum = crypto.createHash('sha1');
	this.password = shasum.update(password).digest('hex');
}

schema.methods.getHash = function (password) {
	var shasum = crypto.createHash('sha1');
	return shasum.update(password).digest('hex');
}

module.exports = mongoose.model("User", schema);