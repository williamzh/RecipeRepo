var recipeRepoApp = angular.module('recipeRepoApp', [
	'ui.router',
	'ngStorage',
	'recipeRepoControllers',
	'recipeRepoDirectives',
	'recipeRepoServices',
	'recipeRepoFilters'
]);

var recipeRepoControllers = angular.module('recipeRepoControllers', []);
var recipeRepoDirectives = angular.module('recipeRepoDirectives', []);
var recipeRepoServices = angular.module('recipeRepoServices', []);
var recipeRepoFilters = angular.module('recipeRepoFilters', []);

recipeRepoApp.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
}]);

recipeRepoApp.run(['localizationInitializer', function(localizationInitializer) {
	localizationInitializer.load();
}]);