recipeRepoServices.factory('apiClient', ['$http', '$q', 'log', function($http, $q, log) {
	var baseUrl = 'http://{1}/api'.assign(Config.appServerUrl);

	function getRecipes() {
		var url = baseUrl + '/recipes';
		
		return $http.get(url).then(function (response) {
			return response.data;
		})
		.catch(function(errorObj) {
			var errMsg = onError(errorObj, 'getRecipes');
			log.error(errMsg);
			return errMsg;
		});
	};

	function getRecipe(id) {
		var url = baseUrl + '/recipes/' + id;

		return $http.get(url).then(function (response) {
			return response.data;
		})
		.catch(function(errorObj) {
			var errMsg = onError(errorObj, 'getRecipe');
			throw new Error(errMsg);
		});
	};

	function addRecipe(recipe) {
		var url = baseUrl + '/recipes';

		return $http.post(url, { recipe: recipe }).then(function (response) {
			return response;
		})
		.catch(function(errorObj) {
			var errMsg = onError(errorObj, 'addRecipe');
			throw new Error(errMsg);
		});
	};

	function updateRecipe(recipe) {
		var url = baseUrl + '/recipes/' + recipe.id;

		return $http.post(url, { recipe: recipe }).then(function (response) {
			return response;
		})
		.catch(function(errorObj) {
			var errMsg = onError(errorObj, 'updateRecipe');
			throw new Error(errMsg);
		});
	};

	function removeRecipe(recipeId) {
		var url = baseUrl + '/recipes/' + recipeId;

		return $http.delete(url).then(function (response) {
			return response;
		})
		.catch(function(errorObj) {
			var errMsg = onError(errorObj, 'removeRecipe');
			throw new Error(errMsg);
		});
	};

	function searchRecipes(query) {
		var url = baseUrl + '/recipes/search';

		return $http.post(url, { query: query }).then(function (response) {
			return response.data;
		})
		.catch(function(errorObj) {
			var errMsg = onError(errorObj, 'searchRecipes');
			throw new Error(errMsg);
		});
	}

	function setMetaData(id, value) {
		var url = baseUrl + '/meta/' + id;

		return $http.post(url, { value: value }).then(function(response) {
			return response;
		})
		.catch(function(errorObj) {
			var errMsg = onError(errorObj, 'setMetaData');
			throw new Error(errMsg);
		});
	};

	function getMetainfo() {
		var url = baseUrl + '/meta';

		return $http.get(url).then(function (response) {
			return response.data;
		})
		.catch(function(errorObj) {
			var errMsg = onError(errorObj, 'getMetainfoKeys');
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
		removeRecipe: removeRecipe,
		searchRecipes: searchRecipes,
		getMetainfo: getMetainfo
	};
}]);