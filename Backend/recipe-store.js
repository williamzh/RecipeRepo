var EsClient = require('./es-client');
require('sugar');

function RecipeStore(client) {
	this.client = client || new EsClient('recipe');
}

RecipeStore.prototype.add = function(recipe, successCallback, errorCallback) {
	if(!recipe) {
		errorCallback('Recipe must be supplied.');
		return;
	}

	this.client.create(recipe).then(function(successMsg) {
		successCallback(successMsg);
	}, function(errorMsg) {
		errorCallback(errorMsg);
	});
};

RecipeStore.prototype.getAll = function(successCallback, errorCallback, options) {
	this.client.getAll().then(function(recipes) {
		if(recipes.length == 0) {
			successCallback(recipes);
			return;
		}

		if(!options) {
			successCallback(recipes);
			return;
		}

		if(options.groupBy) {
			var key = options.groupBy;
			if(!(key in recipes[0].meta)) {
				errorCallback('Failed to get grouped recipes. Key "' + key + '" is invalid.');
				return;
			}

			successCallback(recipes.groupBy(function(r) {
				return r.meta[key];
			}));
		}
		else if(options.sortBy) {
			var key = options.sortBy;
			var sortedRecipes = recipes.sortBy(function(r) { 
				return r.meta[key]; 
			}, true);
			successCallback(sortedRecipes);
		}
		else {
			errorCallback('Failed to group recipes. Invalid options.');
		}
	}, function(errorMsg) {
		errorCallback(errorMsg);
	});
};

RecipeStore.prototype.get = function(recipeId, successCallback, errorCallback) {
	this.client.get(recipeId).then(function(recipe) {
		successCallback(recipe);
	}, function(errorMsg) {
		errorCallback(errorMsg);
	});
};

RecipeStore.prototype.update = function(recipeId, recipe, successCallback, errorCallback) {
	if(!recipeId) {
		errorCallback('Recipe ID must be supplied');
		return;
	}

	if(!recipe) {
		errorCallback('Recipe must be supplied');
		return;
	}

	if(recipeId != recipe.id) {
		errorCallback('Recipe ID mismatch');
		return;
	}

	this.client.update(recipeId, recipe).then(function(successMsg) {
		successCallback(successMsg);
	}, function(errorMsg) {
		errorCallback(errorMsg);
	});
};

RecipeStore.prototype.remove = function(recipeId, successCallback, errorCallback) {
	if(!recipeId) {
		errorCallback('Recipe ID must be supplied');
		return;
	}

	this.client.remove(recipeId).then(function(successMsg) {
		successCallback(successMsg);
	}, function(errorMsg) {
		errorCallback(errorMsg);
	});
};

module.exports = RecipeStore;