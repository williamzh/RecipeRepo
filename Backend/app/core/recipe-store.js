var FakeRecipeClient = require('../dev/fake-recipe-client');
var q = require('q');
require('sugar');

function RecipeStore(client) {
	this.client = client || new FakeRecipeClient();
}

RecipeStore.prototype.add = function(recipe) {
	if(!recipe) {
		var def = q.defer();
		def.reject('Recipe must be supplied.');
		return def.promise;
	}

	return this.client.create(recipe).then(function(successMsg) {
		// TODO: log
		return successMsg;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

RecipeStore.prototype.getAll = function() {
	return this.client.getAll().then(function(recipes) {
		// TODO: log
		return recipes;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

RecipeStore.prototype.get = function(recipeId) {
	return this.client.get(recipeId).then(function(recipe) {
		// TODO: log
		return recipe;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

RecipeStore.prototype.update = function(recipeId, recipe) {
	var def = q.defer();

	if(!recipeId) {
		def.reject('Recipe ID must be supplied');
		return def.promise;
	}

	if(!recipe) {
		def.reject('Recipe must be supplied');
		return def.promise;
	}

	if(recipeId != recipe.id) {
		def.reject('Recipe ID mismatch');
		return def.promise;
	}

	return this.client.update(recipeId, recipe).then(function(successMsg) {
		// TODO: log
		return successMsg;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

RecipeStore.prototype.remove = function(recipeId) {
	if(!recipeId) {
		var def = q.defer();
		def.reject('Recipe ID must be supplied');
		return def.promise;
	}

	return this.client.remove(recipeId).then(function(successMsg) {
		// TODO: log
		return successMsg;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

RecipeStore.prototype.search = function(query) {
	if(!query) {
		var def = q.defer();
		def.reject('Query must be specified.');
		return def.promise;
	}

	return this.client.search(query).then(function(hits) {
		return hits;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

module.exports = RecipeStore;