var auth = require('./auth');
var fs = require('fs');
var config = require('../config');

exports.router = function (app) {
	auth.router(app);

	app.get('/', index)
		.get('/files', getFiles)
		.get('/file/*', getFileContent)
		.put('/file/*', saveFileContent)

	require('./admin').router(app)
}

function index (req, res) {
	res.render('editor')
}

function getFiles (req, res) {
	fs.readdir(config.nginx_dir, function (err, files) {
		if (err) {
			return res.send(500, {
				message: err.toString()
			});
		}

		var fs = [];
		files.forEach(function (file) {
			fs.push({
				url: '/file/'+file,
				name: file
			});
		});

		res.send(200, {
			files: fs
		})
	})
}

function getFileContent (req, res) {
	var filename = req.url.replace('/file', '');
	fs.readFile(config.nginx_dir + filename, function (err, contents) {
		if (err) {
			return res.send(500, {
				message: err.toString()
			});
		}

		res.send(200, {
			contents: contents.toString('utf8')
		})
	});
}

function saveFileContent (req, res) {
	var filename = req.url.replace('/file', '');
	fs.writeFile(config.nginx_dir + filename, req.body.content, {
		encoding: 'utf8',
		mode: 493
	}, function (err) {
		if (err) {
			return res.send(500, {
				message: err.toString()
			});
		}

		res.send(200, {});
	});
}