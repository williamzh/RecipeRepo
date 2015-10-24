var express = require('express');
var RecipeStore = require('../core/recipe-store');
var TokenValidator = require('../core/auth/token-validator');
var q = require('q');

function RecipeController(app, recipeStore, tokenValidator) {
	this.recipeStore = recipeStore || new RecipeStore();
	this.tokenValidator = tokenValidator || new TokenValidator();

	var recipeRouter = express.Router();
	app.use('/api/recipes', recipeRouter);

	// Protect routes
	recipeRouter.use(function(req, res, next) {
		this.tokenValidator.validate(req, res, next);	
	});

	recipeRouter.get('/', function(req, res) {
		this.recipeStore.getAll()
			.then(function(recipes) {
				res.json(200, recipes);
			}).catch(function(err) {
				res.json(500, { error: err });
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
				res.json(500, { error: err });
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
				res.json(500, { error: err });
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
				res.json(500, { error: err });
			});
	});

	recipeRouter.put('/:id', function(req, res) {
		if(!req.params.id || !req.body.recipe) {
			res.json(400, { error: 'Recipe ID and recipe must be provided.' });
			return;
		}

		this.recipeStore.update(req.params.id, req.body.recipe)
			.then(function(data) {
				res.json(200, data);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});

	recipeRouter.delete('/:id', function(req, res) {
		if(!req.params.id) {
			res.json(400, { error: 'Recipe ID must be provided.' });
			return;
		}
		
		this.recipeStore.remove(req.params.id)
			.then(function(data) {
				res.json(200, data);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});
}

module.exports = RecipeController;

