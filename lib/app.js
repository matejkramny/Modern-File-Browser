'use strict';

var express = require('express')
	, config = require('./config')
	, app = express()
	, http = require('http')
	, https = require('https')
	, passport = require('passport')
	, session = require('express-session')
	, MongoStore = require('connect-mongo')(session)
	, fs = require('fs')
	, path = require('path')
	, mongoose = require('mongoose');

app.set('view engine', 'jade');
app.enable('trust proxy');
app.set('views', path.join(__dirname, '/views'));
app.locals.company = config.company;

app.use(function (req, res, next) {
	res.set('x-powered-by', 'nginx-manager');
	next();
})
app.use(require('morgan')(config.production ? 'default' : 'dev'));
app.use(require('cookie-parser')());
app.use(require('body-parser')());
app.use(session({
	secret: config.session_secret,
	name: 'nginx-manager',
	store: new MongoStore({
		mongoose_connection: mongoose.connection,
		auto_reconnect: true,
		stringify: false
	}),
	proxy: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('serve-static')(path.join(__dirname, '..', 'public')));

require('./routes').router(app);

http.createServer(app).listen(config.port);
console.log("Listening to :", config.port);