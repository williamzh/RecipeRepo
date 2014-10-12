var assert = require('assert');
var nock = require('nock');
var recipeStore = require('../recipe-store');

describe('Provided a RecipeStore', function() {
	
	var elasticSearchUrl = 'http://localhost:9200';

	describe('when adding a recipe', function() {
		it('should return error if recipe is not defined', function(done) {
			recipeStore.add(undefined, undefined, function (error) {
				assert.equal(error, 'Recipe must be supplied.');
				done();
			});
		});

		it('should return error if recipe ID is not defined', function(done) {
			recipeStore.add({ recipeId: undefined }, undefined, function (error) {
				assert.equal(error, 'Recipe ID must be supplied.');
				done();
			});
		});

		it('should return error if recipe already exists', function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/recipe/1')
				.reply(200, {
				   "_source": { "recipeId": '1' }
				});

			recipeStore.add({ recipeId: '1' }, undefined, function(error) {
				assert.equal(error, 'Recipe with ID 1 already exists.');
				done();
			});
		});

		it('should add the recipe otherwise', function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/recipe/1')
				.reply(404);

			nock(elasticSearchUrl)
				.put('/reciperepo/recipe/1')
				.reply(201);

			recipeStore.add({ recipeId: 1 }, function(result) {
				assert.equal(result, 'Recipe successfully added.');
				done();
			});
		});
	});

	describe('when getting all recipes', function() {
		it('should return all existing recipes', function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/_search')
				.reply(200, {
					"hits": {
				    	"total": 1,
				    	"hits": [{
				            "_source": { "recipeId": '1' }
				        }, {
				            "_source": { "recipeId": '2' }
				        }]
					}
				});

			recipeStore.getAll(function(hits) {
				assert.equal(hits.length, 2);
				done();
			});
		});

		it('should return empty array if there are no recipes', function(done) {
			nock(elasticSearchUrl)
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

		describe('with grouping', function() {
			beforeEach(function() {
				nock(elasticSearchUrl)
				.get('/reciperepo/_search')
				.reply(200, {
					"hits": {
				    	"total": 1,
				    	"hits": [{
				            "_source": { 
				            	"recipeId": '1',
				            	"meta": {
				            		"cuisine": "Swedish"
				            	}
				            }
				        }, {
				            "_source": { 
				            	"recipeId": '2',
				            	"meta": {
				            		"cuisine": "Italian"
				            	}
				            }
				        }, {
				            "_source": { 
				            	"recipeId": '2',
				            	"meta": {
				            		"cuisine": "Swedish"
				            	}
				            }
				        }]
					}
				});
			});

			it('should return error if key is invalid', function(done) {
				recipeStore.getAll(undefined, function(error) {
					assert.equal(error, 'Failed to get grouped recipes. Key "category" is invalid.');
					done();
				}, { groupBy: 'category' })
			});

			it('should group recipes if key is valid', function(done) {
				recipeStore.getAll(function(result) {
					assert.equal(result['Swedish'].length, 2);
					assert.equal(result['Italian'].length, 1);
					done();
				}, function(error) {}, { groupBy: 'cuisine' })
			});
		});
	});

	describe('when getting recipe by ID', function() {
		it('should return recipe if it exists', function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/recipe/1')
				.reply(200, {
				   "_source": { "recipeId": '1' }
				});

			recipeStore.get('1', function(recipe) {
				assert.equal(recipe.recipeId, '1');
				done();
			});
		});

		it("should return null if recipe doesn't exist", function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/recipe/1')
				.reply(404);

			recipeStore.get('1', function(recipe) {
				assert.equal(recipe, null);
				done();
			});
		});
	});

	describe('when updating an existing recipe', function() {
		it("should return error if recipe IDs don't match", function(done) {
			recipeStore.update('1', { recipeId: '2' }, undefined, function(error) {
				assert.equal(error, 'Recipe ID mismatch');
				done();
			});
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

		it("should return error if recipe doesn't exist", function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/recipe/1')
				.reply(404);

			recipeStore.update('1', { recipeId: '1' }, undefined, function(error) {
				assert.equal(error, 'Recipe with ID 1 does not exist');
				done();
			});
		});

		it('should update an existing recipe correctly', function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/recipe/1')
				.reply(200, {
				   "_source": { "recipeId": '1', "name": 'Spaghetti Bolognese' }
				});

			var expectedPut = nock(elasticSearchUrl)
				.put('/reciperepo/recipe/1', { 
					recipeId: '1', 
					name: 'Spaghetti Carbonara' 
				})
				.reply(200);

			recipeStore.update('1', { recipeId: '1', name: 'Spaghetti Carbonara' }, function(result) {
				assert(expectedPut.isDone());
				assert.equal(result, 'Recipe successfully udpated');
				done();
			});
		});
	});
	
	describe('when removing a recipe', function() {
		it('should return error if no recipe ID is provided', function(done) {
			recipeStore.remove(undefined, undefined, function(error) {
				assert.equal(error, 'Recipe ID must be supplied');
				done();
			});
		});

		it('should return error if recipe does not exist', function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/recipe/1')
				.reply(404);

			recipeStore.remove('1', undefined, function(error) {
				assert.equal(error, "Recipe with ID 1 doesn't exist");
				done();
			});
		});

		it('should remove recipe otherwise', function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/recipe/1')
				.reply(200, {
					"_source": { "recipeId": '1' }
				});

			var expectedDelete = nock(elasticSearchUrl)
				.delete('/reciperepo/recipe/1')
				.reply(200);

			recipeStore.remove('1', function(result) {
				assert(expectedDelete.isDone());
				assert.equal(result, 'Recipe successfully removed');
				done();
			});
		});
	});
});