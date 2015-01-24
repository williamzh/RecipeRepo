describe('Provided a Log service', function() {
	var log;
	var $logMock;

	beforeEach(function() {
		module('recipeRepoServices');

		$logMock = jasmine.createSpyObj('$log', ['info', 'warn', 'error', 'debug']);

		module(function($provide) {
			$provide.value('$log', $logMock);
		});

		inject(function($injector) {
			log = $injector.get('log');
		});
	});

	describe('info()', function() {
		it('should log a message to info', function() {
			log.info('something occured');
			expect($logMock.info).toHaveBeenCalledWith('something occured');
		});
	});

	describe('warn()', function() {
		it('should log a message to warning', function() {
			log.warn('I\'m warning you');
			expect($logMock.warn).toHaveBeenCalledWith('I\'m warning you');
		});
	});

	describe('error()', function() {
		it('should log a message to error if it is a string', function() {
			log.error('an error occured');
			expect($logMock.error).toHaveBeenCalledWith('an error occured');
		});

		it('should log a message to error if it is not a string', function() {
			log.error({ foo: 'bar' });
			expect($logMock.error).toHaveBeenCalledWith('Cannot log error - illegal message type.');
		});
	});

	describe('errorFormat()', function() {
		it('should format messages', function() {
			log.errorFormat('An error occured: {1}, please contact {2}', 'Hey, we\'re testing!', 'sombooody');
			expect($logMock.error).toHaveBeenCalledWith('An error occured: Hey, we\'re testing!, please contact sombooody');
		});
	});

	describe('debug()', function() {
		it('should log a message to debug', function() {
			log.debug('debuggin like a pro');
			expect($logMock.debug).toHaveBeenCalledWith('debuggin like a pro');
		});
	});
});