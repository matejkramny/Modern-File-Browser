var models = require('../models')

exports.router = function (app) {
	app.get('/admin/users', getUsers)
		.post('/admin/users', createUser)
		.put('/admin/users/:uid', saveUser)
}

function getUsers (req, res) {
	res.format({
		json: function () {
			models.User.find({}).select('name email').exec(function (err, users) {
				if (err) throw err;

				res.send({
					users: users
				});
			});
		},
		html: function () {
			res.render('users')
		}
	})
}

function saveUser (req, res) {
	models.User.findOne({
		_id: req.params.uid
	}, function (err, user) {
		if (err) {
			return res.send(500, {
				message: err.toString
			});
		}

		user.update(req.body, function (err) {
			if (err) {
				return res.send(400, {
					message: err.toString()
				});
			}

			res.send(200, {})
		});
	});
}

function createUser (req, res) {
	var user = new models.User();
	user.update(req.body, function (err) {
		if (err) {
			return res.send(400, {
				message: err.toString()
			});
		}

		res.send(200, {});
	})
}