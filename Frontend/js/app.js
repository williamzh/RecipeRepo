var recipeRepoApp = angular.module('recipeRepoApp', [
	'ngRoute'
]);

recipeRepoApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', { 
			templateUrl: 'partials/start.html', 
			controller: 'HomeCtrl'
		}).
		when('/recipes', { 
			templateUrl: 'partials/recipe-list.html', 
			controller: 'RecipeListCtrl' 
		}).
		when('/recipes/:recipeId', { 
			templateUrl: 'partials/recipe-details.html', 
			controller: 'RecipeDetailsCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);