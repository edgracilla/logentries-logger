'use strict';

var Logger   = require('le_node'),
	isJSON   = require('is-json'),
	platform = require('./platform'),
	logger, level;

/*
 * Listen for the data event.
 */
platform.on('log', function (logData) {
	if (isJSON(logData))
		logger.log(level, JSON.parse(logData));
	else
		logger.log(level, logData);
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	try {
		logger.closeConnection();
	}
	catch (error) {
		platform.handleException(error);
	}

	platform.notifyClose();
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	var config = require('./config.json');

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