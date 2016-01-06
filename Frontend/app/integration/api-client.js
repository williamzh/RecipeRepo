recipeRepoServices.service('apiClient', ['$http', '$q', '$log', function($http, $q, $log) {
	var baseUrl = 'http://' + Config.appServerUrl;
	var apiUrl = baseUrl + '/api';

	var onSuccess = function (action, response) {
		$log.debug(action + ': Successfully received response from API.');
		return response.data;
	};

	var onError = function (action, error) {
		if (!error || !error.data) {
			return $q.reject({
				statusCode: -1,
				message: 'An unexpected error occured, but no error details are available. Make sure you have an active network connection.'
			});
		}

		var errResponse = error.data;

    	var logMessage = 'The API call {1} failed with HTTP status {2} ({3}). Additional details: {4} {5}'
    		.assign(action, error.status, error.statusText, errResponse.code || '', errResponse.message || '');
        $log.error(logMessage);

        return $q.reject({
            statusCode: errResponse.code,
            message: errResponse.message
        });
	};

	this.login = function(userName, password) {
		var data = "grant_type=password&username=" + userName + "&password=" + password;

		return $http.post(baseUrl +'/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
			.then(function (response) {	return onSuccess('login', response); })
			.catch(function(error) { 
				if(error.data) {
					// Set error message from server
					error.data.message = error.data.error_description;
				}
				return onError('login', error);
			});
	};

	this.addRecipe = function(recipe) {
		return $http.post(apiUrl + '/recipes', recipe)
			.then(function (response) {	return onSuccess('addRecipe', response.data); })
			.catch(function(error) { return onError('addRecipe', error) });
	};

	this.getRecipe = function(id) {
		return $http.get(apiUrl + '/recipes/' + id)
			.then(function (response) {	return onSuccess('getRecipe', response.data); })
			.catch(function(error) { return onError('getRecipe', error) });
	};

	this.findRecipes = function(findOptions) {
		return $http.post(apiUrl + '/recipes/find', findOptions)
			.then(function (response) {	return onSuccess('findRecipes', response.data); })
			.catch(function(error) { return onError('findRecipes', error) });
	};

	this.searchRecipes = function(query) {
		return $http.get(apiUrl + '/recipes/search/' + query)
			.then(function (response) {	return onSuccess('searchRecipes', response.data); })
			.catch(function(error) { return onError('searchRecipes', error) });
	};

	this.updateRecipe = function(recipe) {
		return $http.put(apiUrl + '/recipes', recipe)
			.then(function (response) {	return onSuccess('updateRecipe', response.data); })
			.catch(function(error) { return onError('updateRecipe', error) });
	};

	this.removeRecipe = function(recipeId) {
		return $http.delete(apiUrl + '/recipes/' + recipeId)
			.then(function (response) {	return onSuccess('removeRecipe', response.data); })
			.catch(function(error) { return onError('removeRecipe', error) });
	};

	this.getMetainfo = function() {
		return $http.get(apiUrl + '/meta')
			.then(function (response) {	return onSuccess('getMetainfo', response.data); })
			.catch(function(error) { return onError('getMetainfo', error) });
	};

	this.addUser = function(user) {
		return $http.post(baseUrl + '/auth/register', user)
			.then(function (response) {	return onSuccess('addUser', response.data); })
			.catch(function(error) { return onError('addUser', error) });
	};

	this.getUser = function() {
		return $http.get(apiUrl + '/user/')
			.then(function (response) {	return onSuccess('getUser', response.data); })
			.catch(function(error) { return onError('getUser', error) });
	};

	this.updateUser = function(user) {
		return $http.post(apiUrl + '/user', user)
			.then(function (response) {	return onSuccess('updateUser', response.data); })
			.catch(function(error) { return onError('updateUser', error) });
	};

	this.getHistory = function() {
		return $http.get(apiUrl + '/user/history')
			.then(function (response) {	return onSuccess('getHistory', response.data); })
			.catch(function(error) { return onError('getHistory', error) });
	};

	this.updateHistory = function(recipeId) {
		return $http.put(apiUrl + '/user/history/' + recipeId)
			.then(function (response) {	return onSuccess('updateHistory', response.data); })
			.catch(function(error) { return onError('updateHistory', error) });
	};

	this.addFavorite = function(recipeId) {
		return $http.put(apiUrl + '/user/favorites/' + recipeId)
			.then(function (response) {	return onSuccess('addFavorite', response.data); })
			.catch(function(error) { return onError('addFavorite', error) });
	};

	this.removeFavorite = function(recipeId) {
		return $http.delete(apiUrl + '/user/favorites/' + recipeId)
			.then(function (response) {	return onSuccess('removeFavorite', response.data); })
			.catch(function(error) { return onError('removeFavorite', error) });
	};

	this.getTranslations = function(langCode) {
		return $http.get(apiUrl + '/translations/' + langCode)
			.then(function (response) {	return onSuccess('translations', response.data); })
			.catch(function(error) { return onError('translations', error) });
	};
}]);