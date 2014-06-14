var passport = require('passport');
var express = require('express');

var models = require('../../models');

require('./setup');

exports.router = function(app) {
	var auth = express.Router();

	auth.get('/password', authenticate)
		.post('/password', doAuthenticate)
		.get('/logout', logout);

	app.use('/auth', auth);

	app.all('*', authMiddleware);
}

function authenticate (req, res) {
	res.render('auth');
}

function doAuthenticate (req, res) {
	// JSON request
	models.User.findOne({
		email: req.body.email
	}, function (err, user) {
		if (!user || user.getHash(req.body.password) != user.password) {
			return res.send(404, {
				message: "User Not Found"
			});
		}

		req.login(user, function (err) {
			if (err) throw err;

			res.send(200, {});
		})
	})
}

function logout (req, res, next) {
	req.logout();
	req.session.destroy();

	next()
}

function authFail (req, res) {
	// TODO a nice fail page
	res.send("Authentication failed")
}

function authMiddleware (req, res, next) {
	if (!req.user) {
		// Not authenticated.
		res.format({
			json: function() {
				res.send(402);
			},
			html: function() {
				res.redirect('/auth/password');
			}
		});
		return;
	}

	next();
}