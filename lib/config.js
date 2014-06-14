'use strict';

var mongoose = require('mongoose');

mongoose.connect(process.env.DB || "mongodb://127.0.0.1/nginx-manager", {
	auto_reconnect: true,
	native_parser: true,
	server: {
		auto_reconnect: true
	}
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb Connection Error:'));
db.once('open', function callback () {
	console.log("Mongodb connection established");
});

exports.production = process.env.NODE_ENV == 'production';
exports.port = process.env.PORT || 3000;
exports.session_secret = process.env.SESSION_SECRET || "mysql-manager^2";
exports.company = process.env.COMPANY || "CastawayLabs LLC";
exports.nginx_dir = process.env.NGINX_DIR || "/etc/nginx/conf.d/";

if (!exports.production) {
	exports.nginx_dir = __dirname+'/../test/res/nginx';
}