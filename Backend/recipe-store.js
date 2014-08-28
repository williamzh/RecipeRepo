var request = require('request');

exports = module.exports = (function recipeController() {

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
			url: 'http://localhost:9200/reciperepo/recipe/' + recipe.recipeId,
			method: 'GET'
		};

		request(config, function(error, response, data) {
			if(response.statusCode == 404) {
				var config = {
					url: 'http://localhost:9200/reciperepo/recipe/' + recipe.recipeId,
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

	function getAllRecipes(successCallback, errorCallback) {
		var config = {
			url: 'http://localhost:9200/reciperepo/_search',
			method: 'GET'
		};

		request(config, function(error, response, data) {
			if(!error && response.statusCode == 200) {
				var parsedData = JSON.parse(data);
				successCallback(parsedData.hits.hits);
			}
			else {
				errorCallback(error);
			}
		});
	}

	function getRecipe(recipeId, successCallback, errorCallback) {
		var config = {
			url: 'http://localhost:9200/reciperepo/recipe/' + recipeId,
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
				url: 'http://localhost:9200/reciperepo/recipe/' + recipeId,
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
				url: 'http://localhost:9200/reciperepo/recipe/' + recipeId,
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