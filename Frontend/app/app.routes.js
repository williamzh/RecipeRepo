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
			templateUrl: 'app/components/profile/register.html'
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
		state('home.favorites', {
			templateUrl: 'app/components/home/_favorites.html'
		}).
		// Recipe
		state('recipe', { 
			url: '/recipe/:recipeId',
			params: {
				referrer: null
			},
			templateUrl: '/app/components/recipe/recipe-details.html'
		}).
		// Manage
		state('manage', {
			url: '/manage',
			templateUrl: '/app/components/manage/my-recipes.html'
		}).
		state('manage/create', {
			url: '/manage/create',
			templateUrl: '/app/components/manage/manage-recipe.html'
		}).
		state('manage/edit', {
			url: '/manage/edit/:recipeId',
			templateUrl: '/app/components/manage/manage-recipe.html'
		}).
		// Profile
		state('profile', {
			url: '/profile',
			templateUrl: '/app/components/profile/edit-profile.html'
		});

		//$urlRouterProvider.otherwise("/");
}]);