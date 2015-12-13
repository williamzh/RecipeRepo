var express = require('express');
var RecipeStore = require('../core/recipe-store');
var TokenValidator = require('../middleware/token-validator');
var q = require('q');
require('sugar');

function RecipeController(app, recipeStore, tokenValidator) {
	this.recipeStore = recipeStore || new RecipeStore();
	this.tokenValidator = tokenValidator || new TokenValidator();

	var recipeRouter = express.Router();
	app.use('/api/recipes', recipeRouter);

	// Protect routes
	recipeRouter.use(function(req, res, next) {
		this.tokenValidator.validate(req, res, next);	
	});

	recipeRouter.get('/top-rated', function(req, res) {
		this.recipeStore.getTopRated()
			.then(function(topRecipes) {
				res.json(200, topRecipes);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	recipeRouter.get('/latest', function(req, res) {
		this.recipeStore.getLatest()
			.then(function(latestRecipes) {
				res.json(200, latestRecipes);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	recipeRouter.get('/:id', function(req, res) {
		if(!req.params.id) {
			res.json(400, { error: 'Recipe ID must be provided.' });
			return;
		}

		this.recipeStore.get(req.params.id)
			.then(function(recipe) {
				res.json(200, recipe);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	recipeRouter.post('/', function(req, res) {
		if(!req.body.recipe) {
			res.json(400, { error: 'Recipe must be provided.' });
			return;
		}

		this.recipeStore.add(req.body.recipe)
			.then(function() {
				res.json(200);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	recipeRouter.put('/:id', function(req, res) {
		if(!req.params.id || !req.body.recipe) {
			res.json(400, { error: 'Recipe ID and recipe must be provided.' });
			return;
		}

		this.recipeStore.update(req.params.id, req.body.recipe)
			.then(function() {
				res.json(200);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	recipeRouter.delete('/:id', function(req, res) {
		if(!req.params.id) {
			res.json(400, { error: 'Recipe ID must be provided.' });
			return;
		}

		this.recipeStore.remove(req.params.id)
			.then(function() {
				res.json(200);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	recipeRouter.post('/search', function(req, res) {
		if(!req.body.query) {
			res.json(400, { error: 'Search query must be provided.' });
			return;
		}

		this.recipeStore.search(req.body.query)
			.then(function(hits) {
				res.json(200, hits);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});
}

module.exports = RecipeController;

