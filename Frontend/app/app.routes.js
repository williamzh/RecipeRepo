recipeRepoApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/home");

	$stateProvider.
		state('home', {
			url: '/' ,
			templateUrl: 'app/components/home/home.html', 
			controller: 'homeController'
		});
		// state('/recipes', { 
		// 	templateUrl: '/app/views/recipe-list.html', 
		// 	controller: 'RecipeListCtrl' 
		// }).
		// state('/recipes/:category', { 
		// 	templateUrl: '/app/views/recipe-sublist.html', 
		// 	controller: 'RecipeSublistCtrl' 
		// }).
		// state('/recipes/:category/:recipeId', { 
		// 	templateUrl: '/app/views/recipe-details.html', 
		// 	controller: 'RecipeDetailsCtrl'
		// }).
		// state('/admin/create/', {
		// 	templateUrl: '/app/views/manage-recipe.html',
		// 	controller: 'ManageRecipeCtrl'
		// }).
		// state('/admin/edit/:recipeId', {
		// 	templateUrl: '/app/views/manage-recipe.html',
		// 	controller: 'ManageRecipeCtrl'
		// });
}]);