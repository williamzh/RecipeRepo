var express = require('express');
var RecipeStore = require('../core/recipe-store');
var TokenValidator = require('../core/auth/token-validator');

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
		this.recipeStore.get(req.params.id)
			.then(function(recipe) {
				res.json(200, recipe);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});

	recipeRouter.post('/', function(req, res) {
		this.recipeStore.add(req.body.recipe)
			.then(function(data) {
				res.json(200, data);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});

	recipeRouter.post('/search', function(req, res) {
		this.recipeStore.search(req.body.query)
			.then(function(hits) {
				res.json(200, hits);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});

	recipeRouter.put('/:id', function(req, res) {
		this.recipeStore.update(req.params.id, req.body.recipe)
			.then(function(data) {
				res.json(200, data);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});

	recipeRouter.delete('/:id', function(req, res) {
		this.recipeStore.remove(req.params.id)
			.then(function(data) {
				res.json(200, data);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});
}

module.exports = RecipeController;

