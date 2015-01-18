describe('Provided a ValidatorExtensions service', function() {

	var logMock;
	var validatorExt;

	beforeEach(function() {
		logMock = { debug: jasmine.createSpy() };

		module('recipeRepoServices', function($provide) {
			$provide.value('log', logMock);
		});

		inject(function($injector) {
			validatorExt = $injector.get('validatorExtensions');
		});
	});

	describe('when validating an array', function() {
		it('should return false if array is not Array', function() {
			expect(validatorExt.validateArray({})).toBe(false);
		});

		it('should return false if array is empty', function() {
			expect(validatorExt.validateArray([])).toBe(false);
		});

		it('should return true if array contains non-objects', function() {
			expect(validatorExt.validateArray([1, 2, 3])).toBe(true);
		});

		it('should return true if array contains objects and object validation is disabled', function() {
			expect(validatorExt.validateArray([{}, { foo: "bar" }, {}])).toBe(true);
		});

		it('should return true if array contains empty objects and object validation is enabled', function() {
			expect(validatorExt.validateArray([{ foo: undefined }, { foo: "bar" }, { foo: null }])).toBe(false);
		});
	});
});