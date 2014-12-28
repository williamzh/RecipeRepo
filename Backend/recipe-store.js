var request = require('request');
require('sugar');
var configManager = require('./config-manager.js');

exports = module.exports = (function recipeStore() {

	var host = configManager.getConfigValue('elasticSearchUrl');

	function addRecipe(recipe, successCallback, errorCallback) {
		if(!recipe) {
			errorCallback('Recipe must be supplied.');
			return;
		}

		if(!recipe.recipeId) {
			errorCallback('Recipe ID must be supplied.');
			return;
		}

		var config = {
			url: 'http://{1}:9200/reciperepo/recipe/{2}'.assign(host, recipe.recipeId),
			method: 'GET'
		};

		request(config, function(error, response, data) {
			if(response.statusCode == 404) {
				var config = {
					url: 'http://{1}:9200/reciperepo/recipe/{2}'.assign(host, recipe.recipeId),
					method: 'PUT',
					body: JSON.stringify(recipe)
				};

				request(config, function(error, response, data) {
					if(!error && response.statusCode == 201) {
						successCallback('Recipe successfully added.');
					}
					else {
						errorCallback(error);
					}
				});
			}
			else if(response.statusCode == 200) {
				errorCallback('Recipe with ID ' + recipe.recipeId + ' already exists.');
			}
			else {
				errorCallback('Failed to add recipe. See error log for details.');
			}
		});
	}

	function getAllRecipes(successCallback, errorCallback, options) {
		var config = {
			url: 'http://{1}:9200/reciperepo/recipe/_search'.assign(host),
			method: 'GET'
		};

		request(config, function(error, response, data) {
			if(!error && response.statusCode == 200) {
				var parsedData = JSON.parse(data);
				var recipes = parsedData.hits.hits.map(function(hit) {
					return hit._source;
				});

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
					successCallback(recipes);
				}
				else {
					errorCallback('Failed to group recipes. Invalid options.');
				}				
			}
			else {
				errorCallback(error);
			}
		});
	}

	function getRecipe(recipeId, successCallback, errorCallback) {
		var config = {
			url: 'http://{1}:9200/reciperepo/recipe/{2}'.assign(host, recipeId),
			method: 'GET'
		};

		request(config, function(error, response, data) {
			if(response.statusCode == 200) {
				var parsedData = JSON.parse(data);
				successCallback(parsedData._source);
			}
			else if(response.statusCode == 404) {
				successCallback(null);
			}
			else {
				errorCallback(error);
			}
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

		getRecipe(recipeId, function(existingRecipe) {
			if(!existingRecipe) {
				errorCallback('Recipe with ID ' + recipeId + ' does not exist');
				return;
			}

			var config = {
				url: 'http://{1}:9200/reciperepo/recipe/{2}'.assign(host, recipeId),
				method: 'PUT',
				body: JSON.stringify(recipe)
			};

			request(config, function(error, response, data) {
				if(!error && response.statusCode == 200) {
					successCallback('Recipe successfully udpated');
				}
				else {
					errorCallback('Failed to update recipe');
				}
			});
		}, errorCallback);
	}

	function removeRecipe(recipeId, successCallback, errorCallback) {
		if(!recipeId) {
			errorCallback('Recipe ID must be supplied');
			return;
		}

		getRecipe(recipeId, function(recipe) {
			if(!recipe) {
				errorCallback("Recipe with ID " + recipeId + " doesn't exist");
				return;
			}

			var config = {
				url: 'http://{1}:9200/reciperepo/recipe/{2}'.assign(host, recipeId),
				method: 'DELETE'
			};

			request(config, function(error, response, data) {
				if(!error && response.statusCode == 200) {
					successCallback('Recipe successfully removed');
				}
				else {
					errorCallback('Failed to remove recipe');
				}
			});
		}, errorCallback);
	}

	return {
		getAll: getAllRecipes,
		get: getRecipe,
		add: addRecipe,
		update: updateRecipe,
		remove: removeRecipe
	}
})();