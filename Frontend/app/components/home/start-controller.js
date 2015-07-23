recipeRepoControllers.controller('startController', ['$scope', '$state', 'apiClient', function($scope, $state, apiClient) {
	$scope.getTopRecipes = function() {
		apiClient.getRecipes()
			.then(function(recipes) {
				$scope.recipes = recipes.to(5);
			})
			.catch(function() {
				// TODO: show error
			});
	};
}]);