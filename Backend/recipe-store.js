var request = require('request');

exports = module.exports = (function recipeController() {

	function getAllRecipes(successCallback, errorCallback) {
		request('http://localhost:9200/reciperepo/_search/', function(error, response, data) {
			if(!error && response.statusCode == 200) {
				successCallback(data);
			}
			else {
				errorCallback(error);
			}
		});
	}

	function getRecipe(recipeId, successCallback, errorCallback) {
		request('http://localhost:9200/reciperepo/recipe/' + recipeId, function(error, response, data) {
			if(!error && response.statusCode == 200) {
				successCallback(data);
			}
			else {
				errorCallback(error);
			}
		});
	}

	return {
		getAll: getAllRecipes,
		get: getRecipe
	}
})();

// exports.get = function(r, q) {
// 	console.log('boo');
// };