var recipeRepoApp = angular.module('recipeRepoApp', [
	'ngRoute'
]);

recipeRepoApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', { 
			templateUrl: 'views/start.html', 
			controller: 'HomeCtrl'
		}).
		when('/recipes', { 
			templateUrl: 'views/recipe-list.html', 
			controller: 'RecipeListCtrl' 
		}).
		when('/recipes/:recipeId', { 
			templateUrl: 'views/recipe-details.html', 
			controller: 'RecipeDetailsCtrl'
		}).
		when('/admin', {
			templateUrl: 'views/manage-recipe.html',
			controller: 'ManageRecipeCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);