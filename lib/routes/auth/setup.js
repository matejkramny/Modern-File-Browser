var passport = require('passport');
var models = require('../../models');
var config = require('../../config');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	models.User.findOne({
		_id: id
	}, done);
});