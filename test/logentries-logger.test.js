'use strict';

const TOKEN = '486716ac-0b6a-40e5-b03d-fe82129948c2';

var cp     = require('child_process'),
	should = require('should'),
	logger;

describe('Logentries Logger', function () {
	this.slow(8000);

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
		it('should notify the parent process when ready within 8 seconds', function (done) {
			this.timeout(8000);

			logger.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			logger.send({
				type: 'ready',
				data: {
					options: {
						token: TOKEN
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