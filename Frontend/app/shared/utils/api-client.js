recipeRepoServices.service('apiClient', ['$http', '$q', 'log', function($http, $q, log) {
	var baseUrl = 'http://{1}/api'.assign(Config.appServerUrl);

	var onSuccess = function (action, response) {
        log.debug(action + ': Successfully received response from API.');
        return response.data;
    };

    var onError = function (action, error) {
        var errorMessage = error;
        if (error.data) {
            errorMessage = error.data.message || error.data;
        }

        log.error(action + ': an error occured (' + error.status + ' ' + error.statusText + '): ' + errorMessage);
        return $q.reject({
            statusCode: error.status || -1,
            message: errorMessage
        });
    };

	this.getRecipes = function() {
		return $http.get(baseUrl + '/recipes')
			.then(function (response) {	return onSuccess('getRecipes', response); })
			.catch(function(error) { return onError('getRecipes', error) });
	};

	this.getRecipe = function(id) {
		return $http.get(baseUrl + '/recipes/' + id)
			.then(function (response) {	return onSuccess('getRecipe', response); })
			.catch(function(error) { return onError('getRecipe', error) });
	};

	this.addRecipe = function(recipe) {
		return $http.post(baseUrl + '/recipes', { recipe: recipe })
			.then(function (response) {	return onSuccess('addRecipe', response); })
			.catch(function(error) { return onError('addRecipe', error) });
	};

	this.updateRecipe = function(recipe) {
		return $http.post(baseUrl + '/recipes/' + recipe.id, { recipe: recipe })
			.then(function (response) {	return onSuccess('updateRecipe', response); })
			.catch(function(error) { return onError('updateRecipe', error) });
	};

	this.removeRecipe = function(recipeId) {
		return $http.delete(baseUrl + '/recipes/' + recipeId)
			.then(function (response) {	return onSuccess('removeRecipe', response); })
			.catch(function(error) { return onError('removeRecipe', error) });
	};

	this.searchRecipes = function(query) {
		return $http.post(baseUrl + '/recipes/search', { query: query })
			.then(function (response) {	return onSuccess('searchRecipes', response); })
			.catch(function(error) { return onError('searchRecipes', error) });
	}

	this.getMetainfo = function() {
		return $http.get(baseUrl + '/meta')
			.then(function (response) {	return onSuccess('getMetainfo', response); })
			.catch(function(error) { return onError('getMetainfo', error) });
	};
}]);