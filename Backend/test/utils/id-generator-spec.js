var assert = require('assert');
var IdGenerator = require('../../utils/id-generator');

describe('Given an IdGenerator', function() {
	var idGenerator;

	beforeEach(function() {
		idGenerator = new IdGenerator();
	});

	describe('no seed array provided', function() {
		it('should use default seed array', function() {
			var id = idGenerator.generateId();
			assert.equal(id, 1);
		});
	});

	describe('seed array is provided', function() {
		describe('incremental option is false', function() {
			it('should use generate first available ID in non-sequential array', function() {
				var id = idGenerator.generateId([1, 3, 6]);
				assert.equal(id, 2);
			});

			it('should use generate first available ID in sequential array', function() {
				var id = idGenerator.generateId([1, 2, 3]);
				assert.equal(id, 4);
			});
		});

		describe('incremental option is true', function() {
			it('should use generate first available ID in non-sequential array', function() {
				var id = idGenerator.generateId([1, 3, 6], true);
				assert.equal(id, 7);
			});

			it('should use generate first available ID in sequential array', function() {
				var id = idGenerator.generateId([1, 2, 3], true);
				assert.equal(id, 4);
			});
		});
	});
});