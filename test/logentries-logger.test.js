'use strict';

var cp     = require('child_process'),
	should = require('should'),
	logger;

describe('Logentries Logger', function () {
	this.slow(5000);

	after('terminate child process', function (done) {
		this.timeout(3000);

		setTimeout(function () {
			logger.kill('SIGKILL');
			done();
		}, 2000);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			should.ok(logger = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(5000);

			logger.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			logger.send({
				type: 'ready',
				data: {
					options: {
						token: '1cc71fff-6476-41cd-b365-e8b8914418c5',
						log_level: 'debug'
					}
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});

	describe('#log', function () {
		it('should process the log data', function (done) {
			logger.send({
				type: 'log',
				data: {
					title: 'Sample Log Title',
					description: 'Sample Log Data'
				}
			}, done);
		});
	});
});