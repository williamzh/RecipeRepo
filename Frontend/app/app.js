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

recipeRepoApp.run(['localizationInitializer', function(localizationInitializer) {
	localizationInitializer.load();
}]);