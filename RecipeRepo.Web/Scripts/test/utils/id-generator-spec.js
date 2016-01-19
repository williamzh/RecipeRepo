describe('Given an idGenerator', function() {
	var idGenerator;

	beforeEach(function() {
		module('recipeRepoApp');
		module('recipeRepoServices');

		inject(function(_idGenerator_) {
			idGenerator = _idGenerator_;
		});
	});

	describe('when generating a sequential ID', function() {
		it('should return 1 if existing IDs is empty array', function() {
			expect(idGenerator.sequentialId([])).toBe(1);
		});

		it('should return next available ID', function() {
			expect(idGenerator.sequentialId([1, 2, 3])).toBe(4);
		});

		it('should reuse previous IDs if possible', function() {
			expect(idGenerator.sequentialId([1, 3, 4])).toBe(2);
		});

		it('should return -1 if max iterations reached', function() {
			var ids = [];
			for(var i = 1; i <= 10001; i++) {
				ids.push(i);
			}

			expect(idGenerator.sequentialId(ids)).toBe(-1);
		});
	});
});