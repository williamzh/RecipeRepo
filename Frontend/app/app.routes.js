recipeRepoApp.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
	$locationProvider.html5Mode(true);

	$stateProvider.
		// Login
		state('login', {
			url: '/login',
			templateUrl: 'app/components/login/login.html'
		}).
		// Reset password
		state('resetPassword', {
			url: '/reset-password',
			templateUrl: 'app/components/login/reset-password.html'
		}).
		// Register
		state('register', {
			abstract: true,
			url: '/register',
			templateUrl: 'app/components/profile/register.html',
			controller: 'createProfileController'	// Declare controller here so that nested states share $scope
		}).
		state('register.create', {
			url: '',
			templateUrl: 'app/components/profile/_create-profile.html'
		}).
		state('register.confirm', {
			templateUrl: 'app/components/profile/_create-confirm.html'
		}).
		// Home
		state('home', {
			url: '/' ,
			templateUrl: 'app/components/home/home.html'
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
		// Recipe
		state('recipe/create', {
			url: '/recipes/create',
			templateUrl: '/app/components/manage/manage-recipe.html'
		}).
		state('recipe', { 
			url: '/recipes/:recipeId',
			// params: {
			// 	recipeId: null,
			// 	referrer: null
			// },
			templateUrl: '/app/components/recipe/recipe-details.html'
		}).
		state('recipe/edit', {
			url: '/recipes/:recipeId/edit',
			templateUrl: '/app/components/manage/manage-recipe.html'
		}).
		// Manage
		state('my-recipes', {
			url: '/my-recipes',
			templateUrl: '/app/components/manage/my-recipes.html'
		}).
		// Profile
		state('profile', {
			url: '/profile',
			templateUrl: '/app/components/profile/edit-profile.html'
		});

		//$urlRouterProvider.otherwise("/");
}]);