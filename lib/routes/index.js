var auth = require('./auth');
var fs = require('fs');
var config = require('../config');
var async = require('async');
var path = require('path');
var querystring = require('querystring');

exports.router = function (app) {
	auth.router(app);

	app.get('/', index)
		.get('/files', getFiles)
		.get('/files/*', getFiles)
		.get('/file/*', getFileContent)
		.put('/file/*', saveFileContent)

	require('./admin').router(app)
}

function index (req, res) {
	res.render('editor')
}

function getFiles (req, res) {
	var dir = querystring.unescape(req.url.replace('/files', ''));

	if (dir.length == 0) {
		dir = process.env.HOME;
	}

	if (dir.split('')[dir.length-1] != '/') {
		dir += '/';
	}

	fs.readdir(dir, function (err, files) {
		if (err) {
			return res.send(500, {
				message: err.toString()
			});
		}

		async.map(files, function (file, cb) {
			var fullpath = path.join(dir, file);
			var f = {
				url: '/file'+fullpath,
				name: file,
				isFolder: false
			}

			fs.stat(fullpath, function (err, stats) {
				if (!err && stats.isDirectory()) {
					f.isFolder = true;
				}

				cb(null, f);
			});
		}, function (err, fs) {
			res.send(200, {
				pwd: dir,
				files: fs
			});
		});
	})
}

function getFileContent (req, res) {
	var filename = querystring.unescape(req.url.replace('/file', ''));

	fs.readFile(filename, function (err, contents) {
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
	var filename = querystring.unescape(req.url.replace('/file', ''));

	fs.writeFile(filename, req.body.content, {
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