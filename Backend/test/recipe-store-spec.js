var assert = require('assert');
var nock = require('nock');
var recipeStore = require('../recipe-store');

describe('Provided a RecipeStore', function() {
	
	describe('when adding a recipe', function() {
		it('should return error if recipe is not defined', function(done) {
			recipeStore(undefined, undefined, function (error) {
				assert.equal(error, 'Recipe must be supplied');
				done();
			});
		});

		it('should return error if recipe ID is not defined', function(done) {
			recipeStore({ id: undefined }, undefined, function (error) {
				assert.equal(error, 'Recipe ID must be supplied');
				done();
			});
		});

		it('should return error if recipe already exists', function(done) {
			nock('http://localhost:9200')
				.get('/reciperepo/recipe/1')
				.reply(200, {[
					id: 1,
					name: 'Spaghetti Bolognese'
				]});

			recipeStore({ id: 1 }, undefined, function(error) {
				assert.equal(error, 'Recipe with ID 1 already exists.');
				done();
			});
		});

		it('should add the recipe otherwise', function(done) {
			var expectation = nock('http://localhost:9200')
				.put('reciperepo/recipe/1')
				.reply(200, {
					// TODO: add ES response
				});

			recipeStore({ id: 1 }, function(result) {
				assert.equal(expectation.isDone(), true);
				done();
			});
		});
	});

	describe('when getting all recipes', function() {
		it('should return all existing recipes', function() {
			
		});

		it('should return null if there are no recipes', function() {

		});
	});
	
});