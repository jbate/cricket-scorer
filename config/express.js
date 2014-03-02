var express = require('express');
var path = require('path');

module.exports = function (app) {
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, '../app/views'));
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, '../public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

}