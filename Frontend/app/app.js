var recipeRepoApp = angular.module('recipeRepoApp', [
	'ui.router',
	'ui.bootstrap',
	'recipeRepoControllers',
	'recipeRepoDirectives',
	'recipeRepoServices'
]);

var recipeRepoControllers = angular.module('recipeRepoControllers', []);
var recipeRepoDirectives = angular.module('recipeRepoDirectives', []);
var recipeRepoServices = angular.module('recipeRepoServices', []);