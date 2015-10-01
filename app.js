'use strict';

var platform    = require('./platform'),
	logger = require('le_node'),
	log, loglevel;

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {

	try { //added try catch since there is no callback for the logger initialization
		 log = new logger({ token: options.token });

		 log.on('error', function(err) {
			 console.error('Error on Logentries.', err);
			 platform.handleException(err);
		 });

		loglevel = options.loglevel;

		platform.log('Connected to Logentries.');
		platform.notifyReady(); // Need to notify parent process that initialization of this plugin is done.

	} catch (error) {
		console.error('Error on Logentries.', error);
		platform.handleException(error);
	}

});

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {

	log.log(loglevel, data);

});