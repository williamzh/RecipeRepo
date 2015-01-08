recipeRepoServices.factory('apiClient', ['$http', '$q', 'log', function($http, $q, log) {
	var baseUrl = 'http://localhost:8001/api';

	function getRecipes(groupBy) {
		var url = baseUrl + '/recipes';
		if(groupBy) {
			url += '?groupBy=' + groupBy;
		}

		return $http.get(url).then(function (response) {
			return response.data;
		}, function(errorObj) {
			onError(errorObj, 'getRecipes');
		});
	};

	function getRecipe(id) {
		var url = baseUrl + '/recipes/' + id;

		return $http.get(url).then(function (response) {
			return response.data;
		}, function(errorObj) {
			onError(errorObj, 'getRecipe');
		});
	};

	function addRecipe(recipe) {
		var url = baseUrl + '/recipes';

		return $http.post(url, { recipe: recipe }).then(function (response) {
			return response;
		}, function(errorObj) {
			onError(errorObj, 'addRecipe');
		});
	};

	function updateRecipe(recipe) {
		var url = baseUrl + '/recipes/' + recipe.id;

		return $http.post(url, { recipe: recipe }).then(function (response) {
			return response;
		}, function(errorObj) {
			var errMsg = onError(errorObj, 'updateRecipe');
			throw new Error(errMsg);
		});
	};

	function getMetainfoKeys() {
		var url = baseUrl + '/meta/keys';

		return $http.get(url).then(function (response) {
			return response.data;
		}, function(errorObj) {
			onError(errorObj, 'getMetainfoKeys');
		});
	};

	function getMetainfoValues(key) {
		var url = baseUrl + '/meta/values/' + key;

		return $http.get(url).then(function (response) {
			return response.data;
		}, function(errorObj) {
			onError(errorObj, 'getMetainfoValues');
		});
	};

	function requestMany() {
		return $q.all(arguments).then(function(results) {
			return results;
		});
	}

	function onError(httpError, methodName) {
		var errorMessage = (typeof httpError.data === 'object') ? httpError.data.error : httpError.data;
		log.error('API call ' + methodName + '() failed with HTTP status ' + httpError.status + ": " + errorMessage);
		return errorMessage;
	}

	return {
		getRecipes: getRecipes,
		getRecipe: getRecipe,
		addRecipe: addRecipe,
		updateRecipe: updateRecipe,
		getMetainfoKeys: getMetainfoKeys,
		getMetainfoValues: getMetainfoValues,
		requestMany: requestMany
	};
}]);