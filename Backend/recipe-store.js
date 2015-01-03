var EsClient = require('./es-client');
require('sugar');

exports = module.exports = (function recipeStore() {

	var client = new EsClient('recipe');

	function addRecipe(recipe, successCallback, errorCallback) {
		if(!recipe) {
			errorCallback('Recipe must be supplied.');
			return;
		}

		client.create(recipe).then(function(successMsg) {
			successCallback(successMsg);
		}, function(errorMsg) {
			errorCallback(errorMsg);
		});
	}

	function getAllRecipes(successCallback, errorCallback, options) {
		client.getAll().then(function(recipes) {
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
	}

	function getRecipe(recipeId, successCallback, errorCallback) {
		client.get(recipeId).then(function(recipe) {
			successCallback(recipe);
		}, function(errorMsg) {
			errorCallback(errorMsg);
		});
	}

	function updateRecipe(recipeId, recipe, successCallback, errorCallback) {
		if(!recipeId) {
			errorCallback('Recipe ID must be supplied');
			return;
		}

		if(!recipe) {
			errorCallback('Recipe must be supplied');
			return;
		}

		if(recipeId != recipe.recipeId) {
			errorCallback('Recipe ID mismatch');
			return;
		}

		client.update(recipeId, recipe).then(function(successMsg) {
			successCallback(successMsg);
		}, function(errorMsg) {
			errorCallback(errorMsg);
		});
	}

	function removeRecipe(recipeId, successCallback, errorCallback) {
		if(!recipeId) {
			errorCallback('Recipe ID must be supplied');
			return;
		}

		client.remove(recipeId).then(function(successMsg) {
			successCallback(successMsg);
		}, function(errorMsg) {
			errorCallback(errorMsg);
		});
	}

	return {
		getAll: getAllRecipes,
		get: getRecipe,
		add: addRecipe,
		update: updateRecipe,
		remove: removeRecipe
	}
})();