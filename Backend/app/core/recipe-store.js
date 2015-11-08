var DbClient = require('../data/db-client');
var q = require('q');
require('sugar');

function RecipeStore(dbClient) {
	this.dbClient = dbClient || new DbClient();
	this.dbType = 'recipes';
}

RecipeStore.prototype.add = function(recipe) {
	if(!recipe) {
		var def = q.defer();
		def.reject(new Error('Recipe must be supplied.'));
		return def.promise;
	}

	var self = this;
	return self.dbClient.searchField('recipeName', recipe.recipeName, self.dbType)
		.then(function(existingRecipe) {
			if(existingRecipe) {
				throw new Error('Recipe already exists.');
			}

			return self.dbClient.add(recipe, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

RecipeStore.prototype.getTopRated = function() {
	return this.dbClient.getAll(this.dbType)
		.then(function(recipes) {
			var topRecipes = recipes
				.filter(function(r) {
					// Don't include recipes with ratings below 3
					return r.meta.rating >= 3;
				})
				.sortBy(function(r) {
					return r.meta.rating;
				}, true)
				.to(10);

			return topRecipes;
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

RecipeStore.prototype.getLatest = function() {
	return this.dbClient.getAll(this.dbType)
		.then(function(recipes) {
			var latestRecipes = recipes.sortBy(function(r) {
				return Date.create(r.meta.created);
			}, true).to(10)

			return latestRecipes;
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

RecipeStore.prototype.get = function(recipeId) {
	return this.dbClient.get(recipeId, this.dbType)
		.then(function(recipe) {
			return recipe || null;
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

RecipeStore.prototype.update = function(recipeId, recipe) {
	var def = q.defer();

	if(!recipeId || !recipe) {
		def.reject(new Error('Recipe and recipe ID must be supplied'));
		return def.promise;
	}

	var self = this;
	return self.dbClient.get(recipeId, self.dbType)
		.then(function(existingRecipe) {
			if(!existingRecipe) {
				throw new Error('Recipe does not exist');
			}

			return self.dbClient.update(recipeId, recipe, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

RecipeStore.prototype.remove = function(recipeId) {
	if(!recipeId) {
		var def = q.defer();
		def.reject(new Error('Recipe ID must be supplied'));
		return def.promise;
	}

	var self = this;
	return self.dbClient.get(recipeId, self.dbType)
		.then(function(existingRecipe) {
			if(!existingRecipe) {
				throw new Error('Recipe does not exist');
			}

			return self.dbClient.remove(recipeId, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

module.exports = RecipeStore;