var request = require('request');

exports = module.exports = (function recipeController() {

	function addRecipe(recipe, successCallback, errorCallback) {
		if(!recipe) {
			errorCallback('Recipe must be supplied');
		}

		if(!recipe.id) {
			errorCallback('Recipe ID must be supplied');
		}

		getRecipe(recipe.id, function(data) {
			if(data.indexOf(recipe) > -1) {
				errorCallback('Recipe with ID ' + recipe.id + ' already exists.');
				return;
			}

			var config = {
				url: 'http://localhost:9200/reciperepo/recipe/',
				method: 'PUT',
				body: recipe
			};

			request(config, function(error, response, data) {
				if(!error && response.statusCode == 200) {
					successCallback(data);
				}
				else {
					errorCallback(error);
				}
			});
		}, errorCallback);
	}

	function getAllRecipes(successCallback, errorCallback) {
		var config = {
			url: 'http://localhost:9200/reciperepo/_search/',
			method: 'GET'
		};

		request(config, function(error, response, data) {
			if(!error && response.statusCode == 200) {
				successCallback(data);
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
			if(!error && response.statusCode == 200) {
				successCallback(data);
			}
			else {
				errorCallback(error);
			}
		});
	}

	function updateRecipe(recipeId, recipe, successCallback, errorCallback) {
		if(recipeId !== recipe) {
			errorCallback('Recipe ID mismatch.');
		}

		if(!recipe || !recipeId) {
			errorCallback('Recipe ID must be supplied');
		}

		getRecipe(recipeId, function(data) {
			if(data.indexOf(recipe) == -1) {
				errorCallback('Recipe with ID ' + recipeId + ' does not exist.');
				return;
			}

			var config = {
				url: 'http://localhost:9200/reciperepo/recipe/',
				method: 'PUT',
				body: recipe
			};

			request(config, function(error, response, data) {
				if(!error && response.statusCode == 200) {
					successCallback(data);
				}
				else {
					errorCallback(error);
				}
			});
		}, errorCallback);
	}

	function removeRecipe(recipeId, successCallback, errorCallback) {
		if(!recipe.id) {
			errorCallback('Recipe ID must be supplied');
		}

		getRecipe(recipe.id, function(data) {
			if(data.indexOf(recipe) === -1) {
				errorCallback();
				return;
			}

			var config = {
				url: 'http://localhost:9200/reciperepo/recipe/' + recipeId,
				method: 'DELETE'
			};

			request(config, function(error, response, data) {
				if(!error && response.statusCode == 200) {
					successCallback(data);
				}
				else {
					errorCallback(error);
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