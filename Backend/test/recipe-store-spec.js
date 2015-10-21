var assert = require('assert');
var sinon = require('sinon');
var q = require('q');
var RecipeStore = require('../app/core/recipe-store');
var DbClient = require('../app/data/db-client');

describe('Given a RecipeStore', function() {
	var recipeStore, dbClient;

	beforeEach(function() {
		dbClient = new DbClient(null);
		recipeStore = new RecipeStore(dbClient);
	});

	describe('when adding a recipe', function() {
		var deferredAdd, deferredGet;

		beforeEach(function() {
			deferredAdd = q.defer();
			sinon.stub(dbClient, 'add').returns(deferredAdd.promise);

			deferredGet = q.defer();
			sinon.stub(dbClient, 'get').returns(deferredGet.promise);

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
			deferredGet.resolve({ id: '1' })

			return recipeStore.add({ id: '1' })
				.then(function () {
					throw new Error('Expected add() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe already exists.');
				});
		});

		it('should add the recipe otherwise', function() {
			deferredGet.resolve(null);
			
			return recipeStore.add({ id: 2 })
				.then(function() {
					assert(dbClient.add.calledWith(sinon.match({ id: 2 }), 'recipes'));
				});
		});	
	});

	describe('when getting all recipes', function() {
		var deferredGetAll;

		beforeEach(function() {
			deferredGetAll = q.defer();
			sinon.stub(dbClient, 'getAll').returns(deferredGetAll.promise);
		});

		it('should return empty array if no recipes exist', function() {
			deferredGetAll.resolve([]);

			return recipeStore.getAll()
				.then(function(result) {
					assert.equal(result.length, 0);
				});
		});

		it('should return all recipes otherwise', function() {
			deferredGetAll.resolve([{ id: '1' }, { id: '2' }]);

			return recipeStore.getAll()
				.then(function(result) {
					assert.equal(result.length, 2);
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

			return recipeStore.get('1')
				.then(function(recipe) {
					assert.strictEqual(recipe, null);
				});
		});

		it('should return recipe if it exists', function() {
			deferredGet.resolve({ id: 1 });

			return recipeStore.get('1')
				.then(function(recipe) {
					assert.equal(recipe.id, 1);
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
			return recipeStore.update(undefined, { id: '1' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe and recipe ID must be supplied');
				});
		});

		it('should return error if recipe is missing', function() {
			return recipeStore.update('1', null)
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe and recipe ID must be supplied');
				});
		});

		it("should return error if recipe IDs don't match", function() {
			return recipeStore.update('1', { id: '2' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe ID mismatch');
				});
		});

		it("should return error if recipe doesn't exist", function() {
			deferredGet.resolve(undefined);

			return recipeStore.update('1', { id: '1' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe does not exist');
				});
		});

		it('should update the recipe otherwise', function() {
			deferredGet.resolve({ id: '1' });

			return recipeStore.update('1', { id: '1' });
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

			return recipeStore.remove(1)
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Recipe does not exist');
				});
		});

		it('should remove the recipe otherwise', function() {
			deferredGet.resolve({ id: '1' });

			return recipeStore.remove('1');
		});
	});
});