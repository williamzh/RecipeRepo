var assert = require('assert');
var nock = require('nock');
var recipeStore = require('../recipe-store');

describe('Provided a RecipeStore', function() {
	
	var elasticSearchPath = 'http://localhost:9200';

	describe('when adding a recipe', function() {
		it('should return error if recipe is not defined', function(done) {
			recipeStore.add(undefined, undefined, function (error) {
				assert.equal(error, 'Recipe must be supplied.');
				done();
			});
		});

		it('should return error if recipe ID is not defined', function(done) {
			recipeStore.add({ id: undefined }, undefined, function (error) {
				assert.equal(error, 'Recipe ID must be supplied.');
				done();
			});
		});

		it('should return error if recipe already exists', function(done) {
			nock(elasticSearchPath)
				.get('/reciperepo/recipe/1')
				.reply(200, {
				   "_index": "reciperepo",
				   "_type": "recipe",
				   "_id": "1",
				   "_version": 12,
				   "found": true,
				   "_source": {
				      "id": 1
				   }
				});

			recipeStore.add({ id: 1 }, undefined, function(error) {
				assert.equal(error, 'Recipe with ID 1 already exists.');
				done();
			});
		});

		it('should add the recipe otherwise', function(done) {
			nock(elasticSearchPath)
				.get('/reciperepo/recipe/1')
				.reply(404, {
				   "_index": "reciperepo",
				   "_type": "recipe",
				   "_id": "2",
				   "found": false
				});

			nock(elasticSearchPath)
				.put('/reciperepo/recipe/1')
				.reply(201);

			recipeStore.add({ id: 1 }, function(result) {
				assert.equal(result, 'Recipe successfully added.');
				done();
			});
		});
	});

	describe('when getting all recipes', function() {
		it('should return all existing recipes', function(done) {
			nock(elasticSearchPath)
				.get('/reciperepo/_search')
				.reply(200, {
					"hits": {
				    	"total": 1,
				    	"max_score": 1,
				    	"hits": [{
				            "_index": "reciperepo",
				            "_type": "recipe",
				            "_id": "1",
				            "_score": 1,
				            "_source": {
				               "id": 1
				            }
				        }, {
				            "_index": "reciperepo",
				            "_type": "recipe",
				            "_id": "2",
				            "_score": 1,
				            "_source": {
				               "id": 2
				            }
				        }]
					}
				});

			recipeStore.getAll(function(hits) {
				assert.equal(hits.length, 2);
				done();
			});
		});

		it('should return empty array if there are no recipes', function(done) {
			nock(elasticSearchPath)
				.get('/reciperepo/_search')
				.reply(200, {
				   "hits": {
				    	"total": 0,
				    	"max_score": null,
				    	"hits": []
					}
				});

			recipeStore.getAll(function(hits) {
				assert.equal(hits.length, 0);
				done();
			});
		});
	});

	describe('when getting recipe by ID', function() {
		it('should return recipe if it exists', function(done) {
			nock(elasticSearchPath)
				.get('/reciperepo/recipe/1')
				.reply(200, {
				   "_index": "reciperepo",
				   "_type": "recipe",
				   "_id": "1",
				   "_version": 12,
				   "found": true,
				   "_source": {
				      "id": 1
				   }
				});

			recipeStore.get('1', function(recipe) {
				assert.equal(recipe.id, '1');
				done();
			});
		});

		it("should return null if recipe doesn't exist", function(done) {
			nock(elasticSearchPath)
				.get('/reciperepo/recipe/1')
				.reply(404, {
					"_index": "reciperepo",
				    "_type": "recipe",
				    "_id": "1",
				    "found": false
				});

			recipeStore.get('1', function(recipe) {
				assert.equal(recipe, null);
				done();
			});
		});
	});

	describe('when updating an existing recipe', function() {
		
	});
	
});