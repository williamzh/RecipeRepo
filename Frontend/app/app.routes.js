recipeRepoApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/");

	$stateProvider.
		state('home', {
			abstract: true,
			url: '/' ,
			templateUrl: 'app/components/home/home.html'
		}).
		state('home.topList', {		// Default nested state
			url: '',	// Match parent URL
			templateUrl: 'app/components/home/_top-list.html'
		}).
		state('home.search', {
			params: {
				query: null
			},
			templateUrl: 'app/components/home/_search.html'
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