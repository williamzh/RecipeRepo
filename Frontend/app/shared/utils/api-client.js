recipeRepoServices.service('apiClient', ['$http', '$q', 'log', function($http, $q, log) {
	var baseUrl = 'http://' + Config.appServerUrl;
	var apiUrl = baseUrl + '/api';

	var onSuccess = function (action, response) {
		log.debug(action + ': Successfully received response from API.');
		return response.data;
	};

	var onError = function (action, error) {
		var errorMessage = error;
		if (error.data) {
			errorMessage = error.data.message || error.data;
		}

		var formattedMsg = '{1}: an error occured{2}: {3}'.assign(
			action,
			(error.status && error.statusText) ? ' (' + error.status + ' ' + error.statusText + ')' : '',
			errorMessage);

		log.error(formattedMsg);
		
		return $q.reject({
			statusCode: error.status || -1,
			message: errorMessage
		});
	};

	this.login = function(userName, password) {
		return $http.post(baseUrl +'/auth/login', { userName: userName, password: password })
			.then(function (response) {	return onSuccess('login', response); })
			.catch(function(error) { return onError('login', error) });
	};

	this.getTopRecipes = function() {
		return $http.get(apiUrl + '/recipes/top-rated')
			.then(function (response) {	return onSuccess('getTopRecipes', response); })
			.catch(function(error) { return onError('getTopRecipes', error) });
	};

	this.getLatestRecipes = function() {
		return $http.get(apiUrl + '/recipes/latest')
			.then(function (response) {	return onSuccess('getLatestRecipes', response); })
			.catch(function(error) { return onError('getLatestRecipes', error) });
	};

	this.getRecipe = function(id) {
		return $http.get(apiUrl + '/recipes/' + id)
			.then(function (response) {	return onSuccess('getRecipe', response); })
			.catch(function(error) { return onError('getRecipe', error) });
	};

	this.addRecipe = function(recipe) {
		return $http.post(apiUrl + '/recipes', { recipe: recipe })
			.then(function (response) {	return onSuccess('addRecipe', response); })
			.catch(function(error) { return onError('addRecipe', error) });
	};

	this.updateRecipe = function(recipe) {
		return $http.post(apiUrl + '/recipes/' + recipe.id, { recipe: recipe })
			.then(function (response) {	return onSuccess('updateRecipe', response); })
			.catch(function(error) { return onError('updateRecipe', error) });
	};

	this.removeRecipe = function(recipeId) {
		return $http.delete(apiUrl + '/recipes/' + recipeId)
			.then(function (response) {	return onSuccess('removeRecipe', response); })
			.catch(function(error) { return onError('removeRecipe', error) });
	};

	this.searchRecipes = function(query) {
		return $http.post(apiUrl + '/recipes/search', { query: query })
			.then(function (response) {	return onSuccess('searchRecipes', response); })
			.catch(function(error) { return onError('searchRecipes', error) });
	}

	this.getMetainfo = function() {
		return $http.get(apiUrl + '/meta')
			.then(function (response) {	return onSuccess('getMetainfo', response); })
			.catch(function(error) { return onError('getMetainfo', error) });
	};

	this.addUser = function(user) {
		return $http.post(baseUrl + '/auth/register', { user: user })
			.then(function (response) {	return onSuccess('addUser', response); })
			.catch(function(error) { return onError('addUser', error) });
	};

	this.getUser = function(userName) {
		return $http.get(apiUrl + '/user/' + userName)
			.then(function (response) {	return onSuccess('getUser', response); })
			.catch(function(error) { return onError('getUser', error) });
	};

	this.updateUser = function(userName, user) {
		return $http.post(apiUrl + '/user/' + userName, { user: user })
			.then(function (response) {	return onSuccess('updateUser', response); })
			.catch(function(error) { return onError('updateUser', error) });
	};

	this.getTranslations = function() {
		return $http.get(apiUrl + '/lang/translations')
			.then(function (response) {	return onSuccess('translations', response); })
			.catch(function(error) { return onError('translations', error) });
	};
}]);