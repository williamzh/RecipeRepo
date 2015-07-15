var recipeRepoApp = angular.module('recipeRepoApp', [
	'ui.router',
	'ui.bootstrap',
	'ngStorage',
	'recipeRepoControllers',
	'recipeRepoDirectives',
	'recipeRepoServices'
]);

var recipeRepoControllers = angular.module('recipeRepoControllers', []);
var recipeRepoDirectives = angular.module('recipeRepoDirectives', []);
var recipeRepoServices = angular.module('recipeRepoServices', []);

recipeRepoApp.run(['$localStorage', 'apiClient', function($localStorage, apiClient) {
	// Save translations in local storage
    apiClient.getTranslations()
		.then(function(translations) {
			$localStorage.translations = translations;
		})
		.catch(function(error) {
			throw Error('Fatal: could not get translations.');
		});
}]);