recipeRepoApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/");

	$stateProvider.
		// Login
		state('login', {
			url: '/login',
			templateUrl: 'app/components/login/login.html'
		}).
		// Home
		state('home', {
			abstract: true,
			url: '/' ,
			templateUrl: 'app/components/home/home.html'
		}).
		state('home.start', {		// Default nested state
			url: '',	// Match parent URL
			templateUrl: 'app/components/home/_start.html'
		}).
		state('home.search', {
			resolve: {
				searchQueryProvider: 'searchQueryProvider'
			},
			params: {
				query: null
			},
			templateUrl: 'app/components/home/_search.html'
		}).
		state('home.favorites', {
			templateUrl: 'app/components/home/_favorites.html'
		}).
		// Recipe
		state('recipe', { 
			url: '/recipe/:recipeId',
			templateUrl: '/app/components/recipe/recipe-details.html'
		}).
		// Manage
		state('manage', {
			url: '/manage',
			templateUrl: '/app/components/manage/manage-recipe.html'
		}).
		state('manage/edit', {
			url: '/manage/:recipeId',
			templateUrl: '/app/components/manage/manage-recipe.html'
		});
}]);