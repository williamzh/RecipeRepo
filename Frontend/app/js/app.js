var recipeRepoApp = angular.module('recipeRepoApp', [
	'ngRoute',
	'ui.bootstrap',
	'recipeRepoControllers',
	'recipeRepoDirectives',
	'recipeRepoServices'
]);

recipeRepoApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.
		when('/', { 
			templateUrl: '/app/views/start.html', 
			controller: 'HomeCtrl'
		}).
		when('/recipes', { 
			templateUrl: '/app/views/recipe-list.html', 
			controller: 'RecipeListCtrl' 
		}).
		when('/recipes/:recipeId', { 
			templateUrl: '/app/views/recipe-details.html', 
			controller: 'RecipeDetailsCtrl'
		}).
		when('/admin/create/', {
			templateUrl: '/app/views/manage-recipe.html',
			controller: 'ManageRecipeCtrl'
		}).
		when('/admin/edit/:recipeId', {
			templateUrl: '/app/views/manage-recipe.html',
			controller: 'ManageRecipeCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});

	//$locationProvider.html5Mode(true);
}]);

var recipeRepoControllers = angular.module('recipeRepoControllers', []);
var recipeRepoDirectives = angular.module('recipeRepoDirectives', []);
var recipeRepoServices = angular.module('recipeRepoServices', []);