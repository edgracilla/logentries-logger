'use strict';

var domain   = require('domain'),
	platform = require('./platform'),
	logger, level;

/*
 * Listen for the data event.
 */
platform.on('log', function (logData) {
	var d = domain.create();

	d.once('error', function () {
		logger.log(level, logData);
		d.exit();
	});

	d.run(function () {
		logData = JSON.parse(logData);

		var logLevel = level;

		if (logData.level) {
			logLevel = logData.level;
			delete logData.level;
		}

		logger.log(logLevel, JSON.parse(logData));
		d.exit();
	});
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	var d = domain.create();

	d.once('error', function (error) {
		console.error(error);
		platform.handleException(error);
		platform.notifyClose();
		d.exit();
	});

	d.run(function () {
		logger.closeConnection();
		platform.notifyClose();
		d.exit();
	});
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	var Logger = require('le_node'),
		config = require('./config.json');

	level = options.log_level || config.log_level.default;

	logger = new Logger({
		token: options.token
	});

	logger.on('error', function (error) {
		console.error('Error on Logentries.', error);
		platform.handleException(error);
	});

	platform.notifyReady();
});