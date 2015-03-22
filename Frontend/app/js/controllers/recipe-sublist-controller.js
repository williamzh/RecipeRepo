recipeRepoControllers.controller('RecipeSublistCtrl', ['$scope', '$routeParams', 'apiClient', 'log', function($scope, $routeParams, apiClient, log) {

	// TODO: validate route parameters

	$scope.category = $routeParams.category;

	apiClient.getRecipes('category').then(function(recipes) {
		$scope.recipes = recipes[$scope.category];
	}, function() {
		log.error('RecipeSublistCtrl: Failed to get recipes.');
		$scope.showErrorAlert = true;
	});
}]);
