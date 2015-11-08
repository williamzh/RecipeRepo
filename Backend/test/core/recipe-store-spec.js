var assert = require('assert');
var sinon = require('sinon');
var q = require('q');
var RecipeStore = require('../../app/core/recipe-store');
var DbClient = require('../../app/data/db-client');

describe('Given a RecipeStore', function() {
	var recipeStore, dbClient;

	beforeEach(function() {
		dbClient = new DbClient(null);
		recipeStore = new RecipeStore(dbClient);
	});

	describe('when adding a recipe', function() {
		var deferredAdd, deferredSearch;

		beforeEach(function() {
			deferredAdd = q.defer();
			sinon.stub(dbClient, 'add').returns(deferredAdd.promise);

			deferredSearch = q.defer();
			sinon.stub(dbClient, 'searchField').returns(deferredSearch.promise);

			deferredAdd.resolve();
		});

		it('should return error if no recipe is provided', function() {
			return recipeStore.add(undefined)
				.then(function () {
					throw new Error('Expected add() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe must be supplied.');
				});
		});

		it('should return error recipe already exists', function() {
			deferredSearch.resolve({ recipeName: 'Test recipe 1' })

			return recipeStore.add({ recipeName: 'Test recipe 1' })
				.then(function () {
					throw new Error('Expected add() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe already exists.');
				});
		});

		it('should add the recipe otherwise', function() {
			deferredSearch.resolve(null);
			
			return recipeStore.add({ recipeName: 'Test recipe 1' })
				.then(function() {
					assert(dbClient.add.calledWith(sinon.match({ recipeName: 'Test recipe 1' }), 'recipes'));
				});
		});	
	});

	describe('when getting top rated recipes', function() {
		var deferredGetAll;

		beforeEach(function() {
			deferredGetAll = q.defer();
			sinon.stub(dbClient, 'getAll').returns(deferredGetAll.promise);
		});

		it('should return empty array if no recipes exist', function() {
			deferredGetAll.resolve([]);

			return recipeStore.getTopRated('recipes')
				.then(function(result) {
					assert.equal(result.length, 0);
				});
		});

		it('should return top rated recipes in descending order', function() {
			deferredGetAll.resolve([
				{ meta: { rating: 1 }}, 
				{ meta: { rating: 2 }},
				{ meta: { rating: 3 }}, 
				{ meta: { rating: 4 }},
				{ meta: { rating: 5 }}
			]);

			return recipeStore.getTopRated()
				.then(function(result) {
					assert.equal(result.length, 3);

					assert.equal(result[0].meta.rating, 5);
					assert.equal(result[1].meta.rating, 4);
					assert.equal(result[2].meta.rating, 3);
				});
		});

		it('should limit number of items if more than 10', function() {
			deferredGetAll.resolve([
				{ meta: { rating: 3 }}, { meta: { rating: 3 }}, { meta: { rating: 3 }}, { meta: { rating: 3 }}, { meta: { rating: 3 }},
				{ meta: { rating: 4 }}, { meta: { rating: 4 }}, { meta: { rating: 4 }}, { meta: { rating: 4 }}, { meta: { rating: 4 }},
				{ meta: { rating: 5 }}, { meta: { rating: 5 }}, { meta: { rating: 5 }}, { meta: { rating: 5 }}, { meta: { rating: 5 }}
			]);

			return recipeStore.getTopRated()
				.then(function(result) {
					assert.equal(result.length, 10);
				});
		});
	});

	describe('when getting latest recipes', function() {
		var deferredGetAll;

		beforeEach(function() {
			deferredGetAll = q.defer();
			sinon.stub(dbClient, 'getAll').returns(deferredGetAll.promise);
		});

		it('should return empty array if no recipes exist', function() {
			deferredGetAll.resolve([]);

			return recipeStore.getLatest('recipes')
				.then(function(result) {
					assert.equal(result.length, 0);
				});
		});

		it('should return latest recipes in descending order', function() {
			deferredGetAll.resolve([
				{ meta: { created: '2015-01-01T20:00Z' }},
				{ meta: { created: '2015-02-01T00:00Z' }},
				{ meta: { created: '2015-01-01T00:00Z' }},
				{ meta: { created: '2015-04-25T00:00Z' }},
				{ meta: { created: '2015-03-01T00:00Z' }}
			]);

			return recipeStore.getLatest()
				.then(function(result) {
					assert.equal(result.length, 5);

					assert.equal(result[0].meta.created, '2015-04-25T00:00Z');
					assert.equal(result[1].meta.created, '2015-03-01T00:00Z');
					assert.equal(result[2].meta.created, '2015-02-01T00:00Z');
					assert.equal(result[3].meta.created, '2015-01-01T20:00Z');
					assert.equal(result[4].meta.created, '2015-01-01T00:00Z');
				});
		});

		it('should limit number of items if more than 10', function() {
			deferredGetAll.resolve([
				{ meta: { created: '2015-01-01T00:00Z' }},
				{ meta: { created: '2015-01-02T00:00Z' }},
				{ meta: { created: '2015-01-03T00:00Z' }},
				{ meta: { created: '2015-01-04T00:00Z' }},
				{ meta: { created: '2015-01-05T00:00Z' }},
				{ meta: { created: '2015-01-06T00:00Z' }},
				{ meta: { created: '2015-01-07T00:00Z' }},
				{ meta: { created: '2015-01-08T00:00Z' }},
				{ meta: { created: '2015-01-09T00:00Z' }},
				{ meta: { created: '2015-01-10T00:00Z' }},
				{ meta: { created: '2015-01-11T00:00Z' }}
			]);

			return recipeStore.getLatest()
				.then(function(result) {
					assert.equal(result.length, 10);
				});
		});
	});

	describe('when getting recipe by ID', function() {
		var deferredGet;

		beforeEach(function() {
			deferredGet = q.defer();

			sinon.stub(dbClient, 'get').returns(deferredGet.promise);
		});

		it('should return null if recipe does not exist', function() {
			deferredGet.resolve(undefined);

			return recipeStore.get('563d33a5dbaab8d41abdf6ae')
				.then(function(recipe) {
					assert.strictEqual(recipe, null);
				});
		});

		it('should return recipe if it exists', function() {
			deferredGet.resolve({ _id: '563d33a5dbaab8d41abdf6ae' });

			return recipeStore.get('563d33a5dbaab8d41abdf6ae')
				.then(function(recipe) {
					assert.equal(recipe._id, '563d33a5dbaab8d41abdf6ae');
				});
		});
	});

	describe('when updating a recipe', function() {
		var deferredUpdate, deferredGet;

		beforeEach(function() {
			deferredUpdate = q.defer();
			clientStub = sinon.stub(dbClient, 'update').returns(deferredUpdate.promise);

			deferredGet = q.defer();
			sinon.stub(dbClient, 'get').returns(deferredGet.promise);

			deferredUpdate.resolve();
		});

		it('should return error if recipe ID is missing', function() {
			return recipeStore.update(undefined, { recipeName: 'Test recipe 1' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe and recipe ID must be supplied');
				});
		});

		it('should return error if recipe is missing', function() {
			return recipeStore.update('563d33a5dbaab8d41abdf6ae', null)
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe and recipe ID must be supplied');
				});
		});

		it("should return error if recipe doesn't exist", function() {
			deferredGet.resolve(undefined);

			return recipeStore.update('563d33a5dbaab8d41abdf6ae', { recipeName: 'Test recipe 1' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe does not exist');
				});
		});

		it('should update the recipe otherwise', function() {
			deferredGet.resolve({ _id: '563d33a5dbaab8d41abdf6ae' });

			return recipeStore.update('563d33a5dbaab8d41abdf6ae', { recipeName: 'Test recipe 1' });
		});
	});
	
	describe('when removing a recipe', function() {
		var deferredRemove, deferredGet;

		beforeEach(function() {
			deferredRemove = q.defer();
			clientStub = sinon.stub(dbClient, 'remove').returns(deferredRemove.promise);

			deferredGet = q.defer();
			sinon.stub(dbClient, 'get').returns(deferredGet.promise);

			deferredRemove.resolve();
		});

		it('should return error if recipe ID is missing', function() {
			return recipeStore.remove()
				.then(function(error) {
					throw new Error('Expected remove() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe ID must be supplied');
				});
		});

		it("should return error if recipe doesn't exist", function() {
			deferredGet.resolve(undefined);

			return recipeStore.remove('563d33a5dbaab8d41abdf6ae')
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe does not exist');
				});
		});

		it('should remove the recipe otherwise', function() {
			deferredGet.resolve({ _id: '563d33a5dbaab8d41abdf6ae' });

			return recipeStore.remove('563d33a5dbaab8d41abdf6ae');
		});
	});
});