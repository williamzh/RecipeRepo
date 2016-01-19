recipeRepoApp.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
	$locationProvider.html5Mode(true);

	$stateProvider.
		// Login
		state('login', {
			url: '/login',
			templateUrl: '/Scripts/app/areas/login/login.html'
		}).
		// Reset password
		state('resetPassword', {
			url: '/reset-password',
			templateUrl: '/Scripts/app/areas/login/reset-password.html'
		}).
		// Register
		state('register', {
			abstract: true,
			url: '/register',
			templateUrl: '/Scripts/app/areas/profile/register.html',
			controller: 'createProfileController'	// Declare controller here so that nested states share $scope
		}).
		state('register.create', {
			url: '',
			templateUrl: '/Scripts/app/areas/profile/_create-profile.html'
		}).
		state('register.confirm', {
			templateUrl: '/Scripts/app/areas/profile/_create-confirm.html'
		}).
		// Home
		state('home', {
			url: '/' ,
			templateUrl: '/Scripts/app/areas/home/home.html'
		}).
		// Search
		state('search', {
			url: '/search?query',
			templateUrl: '/Scripts/app/areas/search/search.html'
		}).
		// Recipe
		state('recipe/create', {
			url: '/recipes/create',
			templateUrl: '/Scripts/app/areas/recipe/manage-recipe.html'
		}).
		state('recipe', { 
			url: '/recipes/:recipeId',
			templateUrl: '/Scripts/app/areas/recipe/recipe-details.html'
		}).
		state('recipe/edit', {
			url: '/recipes/:recipeId/edit',
			templateUrl: '/Scripts/app/areas/recipe/manage-recipe.html'
		}).
		// My recipes
		state('my-recipes', {
			url: '/my-recipes',
			templateUrl: '/Scripts/app/areas/my-recipes/my-recipes.html'
		}).
		// Profile
		state('profile', {
			url: '/profile',
			templateUrl: '/Scripts/app/areas/profile/edit-profile.html'
		});

		//$urlRouterProvider.otherwise("/");
}]);