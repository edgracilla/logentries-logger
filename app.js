'use strict';

var platform = require('./platform'),
	logger, level;

/*
 * Listen for the data event.
 */
platform.on('log', function (logData) {
	logger.log(level, logData);
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