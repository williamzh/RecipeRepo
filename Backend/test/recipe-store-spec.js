var assert = require('assert');
var sinon = require('sinon');
var q = require('q');
var EsClient = require('../es-client');
var RecipeStore = require('../recipe-store');

describe('Provided a RecipeStore', function() {
	var elasticSearchUrl = 'http://localhost:9200';
	var deferred, esClient, recipeStore;

	beforeEach(function() {
		deferred = q.defer();
		esClient = new EsClient('foo');
		recipeStore = new RecipeStore(esClient);
	});

	describe('when adding a recipe', function() {
		var clientStub;

		beforeEach(function() {
			clientStub = sinon.stub(esClient, 'create').returns(deferred.promise);
		});

		it('should return error if recipe is not defined', function(done) {
			recipeStore.add(undefined, undefined, function (error) {
				assert.equal(error, 'Recipe must be supplied.');
				done();
			});
		});

		it('should add the recipe otherwise', function(done) {
			deferred.resolve('Item created');

			recipeStore.add({ recipeId: 1 }, function(result) {
				sinon.assert.calledWith(clientStub, { recipeId: 1 });
				assert.equal(result, 'Item created');
				done();
			});
		});	
	});

	describe('when getting all recipes', function() {
		beforeEach(function() {
			sinon.stub(esClient, 'getAll').returns(deferred.promise);
		});

		it('should return empty array if there are no recipes', function(done) {
			deferred.resolve([]);

			recipeStore.getAll(function(hits) {
				assert.equal(hits.length, 0);
				done();
			});
		});

		it('should return all recipes if no options are provided', function(done) {
			deferred.resolve([
				{ id: 1 },
				{ id: 2 }
			]);

			recipeStore.getAll(function(hits) {
				assert.equal(hits.length, 2);
				done();
			});
		});

		describe('with options', function() {
			it('should return error if option is invalid', function(done) {
				deferred.resolve([
					{ id: 1 },
					{ id: 2 }
				]);

				recipeStore.getAll(undefined, function(error) {
					assert.equal(error, 'Failed to group recipes. Invalid options.');
					done();
				}, { nonExistentOption: 'so_fail' })
			});

			it('should group recipes if group key is valid', function(done) {
				deferred.resolve([
					{ id: 1, meta: { cuisine: 'Swedish' } },
					{ id: 2, meta: { cuisine: 'Swedish' } },
					{ id: 3, meta: { cuisine: 'Chinese' } },
				]);

				recipeStore.getAll(function(result) {
					assert.equal(result['Swedish'].length, 2);
					assert.equal(result['Chinese'].length, 1);
					done();
				}, function(error) {}, { groupBy: 'cuisine' })
			});

			it('should sort recipes if sort key is valid', function(done) {
				deferred.resolve([
					{ id: 1, meta: { rating: 3 } },
					{ id: 2, meta: { rating: 5 } },
					{ id: 3, meta: { rating: 4.5 } },
				]);

				recipeStore.getAll(function(result) {
					assert.equal(result[0].id, 2);
					assert.equal(result[1].id, 3);
					assert.equal(result[2].id, 1);
					done();
				}, function(error) {}, { sortBy: 'rating' })
			});
		});
	});

	describe('when getting recipe by ID', function() {
		beforeEach(function() {
			sinon.stub(esClient, 'get').returns(deferred.promise);
		});

		it('should return recipe if it exists', function(done) {
			deferred.resolve({ id: 1 });

			recipeStore.get('1', function(recipe) {
				assert.equal(recipe.id, 1);
				done();
			});
		});
	});

	describe('when updating an existing recipe', function() {
		var clientStub;

		beforeEach(function() {
			clientStub = sinon.stub(esClient, 'update').returns(deferred.promise);
		});

		it('should return error if recipe ID is missing', function(done) {
			recipeStore.update(undefined, { recipeId: '1' }, undefined, function(error) {
				assert.equal(error, 'Recipe ID must be supplied');
				done();
			});
		});

		it('should return error if recipe is missing', function(done) {
			recipeStore.update('1', undefined, undefined, function(error) {
				assert.equal(error, 'Recipe must be supplied');
				done();
			});
		});

		it("should return error if recipe IDs don't match", function(done) {
			recipeStore.update('1', { id: '2' }, undefined, function(error) {
				assert.equal(error, 'Recipe ID mismatch');
				done();
			});
		});

		it('should update the recipe otherwise', function(done) {
			deferred.resolve('Item updated');

			var updatedRecipe = { id: '1', name: 'Spaghetti Carbonara' };
			recipeStore.update('1', updatedRecipe, function(result) {
				sinon.assert.calledWith(clientStub, '1', updatedRecipe);
				assert.equal(result, 'Item updated');
				done();
			});
		});
	});
	
	describe('when removing a recipe', function() {
		var clientStub;

		beforeEach(function() {
			clientStub = sinon.stub(esClient, 'remove').returns(deferred.promise);
		});

		it('should return error if no recipe ID is provided', function(done) {
			recipeStore.remove(undefined, undefined, function(error) {
				assert.equal(error, 'Recipe ID must be supplied');
				done();
			});
		});

		it('should remove the recipe otherwise', function(done) {
			deferred.resolve('Item removed');

			recipeStore.remove('1', function(result) {
				sinon.assert.calledWith(clientStub, '1');
				assert.equal(result, 'Item removed');
				done();
			});
		});
	});
});