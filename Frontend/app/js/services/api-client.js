recipeRepoServices.factory('apiClient', ['$http', '$q', 'log', function($http, $q, log) {
	var baseUrl = 'http://192.168.1.95:8001/api';

	function getRecipes(groupBy) {
		var url = baseUrl + '/recipes';
		if(groupBy) {
			url += '?groupBy=' + groupBy;
		}

		return $http.get(url).then(function (response) {
			return response.data;
		}, function(errorObj) {
			var errMsg = onError(errorObj, 'getRecipes');
			throw new Error(errMsg);
		});
	};

	function getRecipe(id) {
		var url = baseUrl + '/recipes/' + id;

		return $http.get(url).then(function (response) {
			return response.data;
		}, function(errorObj) {
			var errMsg = onError(errorObj, 'getRecipe');
			throw new Error(errMsg);
		});
	};

	function addRecipe(recipe) {
		var url = baseUrl + '/recipes';

		return $http.post(url, { recipe: recipe }).then(function (response) {
			return response;
		}, function(errorObj) {
			var errMsg = onError(errorObj, 'addRecipe');
			throw new Error(errMsg);
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

	function searchRecipes(query) {
		var url = baseUrl + '/recipes/search';

		return $http.post(url, { query: query }).then(function (response) {
			return response.data;
		}, function(errorObj) {
			var errMsg = onError(errorObj, 'searchRecipes');
			throw new Error(errMsg);
		});
	}

	function getMetainfoKeys() {
		var url = baseUrl + '/meta/keys';

		return $http.get(url).then(function (response) {
			return response.data;
		}, function(errorObj) {
			var errMsg = onError(errorObj, 'getMetainfoKeys');
			throw new Error(errMsg);
		});
	};

	function getMetainfoValues(key) {
		var url = baseUrl + '/meta/values/' + key;

		return $http.get(url).then(function (response) {
			return response.data;
		}, function(errorObj) {
			var errMsg = onError(errorObj, 'getMetainfoValues');
			throw new Error(errMsg);
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
		searchRecipes: searchRecipes,
		getMetainfoKeys: getMetainfoKeys,
		getMetainfoValues: getMetainfoValues,
		requestMany: requestMany
	};
}]);