//var FakeRecipeClient = require('../dev/fake-recipe-client');
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
	return self.dbClient.get(recipe.id)
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

RecipeStore.prototype.getAll = function() {
	return this.dbClient.getAll(this.dbType)
		.then(function(recipes) {
			// TODO: log
			return recipes;
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

	if(recipeId != recipe.id) {
		def.reject(new Error('Recipe ID mismatch'));
		return def.promise;
	}

	var self = this;
	return self.dbClient.get(recipeId)
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
	return self.dbClient.get(recipeId)
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

RecipeStore.prototype.search = function(query) {
	if(!query) {
		var def = q.defer();
		def.reject('Query must be specified.');
		return def.promise;
	}

	return this.dbClient.search(query, this.dbType)
		.then(function(hits) {
			return hits;
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

module.exports = RecipeStore;