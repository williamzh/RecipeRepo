recipeRepoApp.controller('RecipeListCtrl', ['$scope', '$q', 'apiClient', function($scope, $q, apiClient) {

	apiClient.requestMany(apiClient.getRecipes('category'), apiClient.getMetainfoKeys()).then(function(results) {
		$scope.categories = results[0];

		$scope.groupKeys = results[1];
		$scope.selectedGrouping = $scope.groupKeys[0];
	});

	$scope.updateRecipeGrouping = function() {
		apiClient.getRecipes($scope.selectedGrouping).then(function(categories) {
			$scope.categories = categories;
		});
	};
}]);
