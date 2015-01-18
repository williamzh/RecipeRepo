recipeRepoApp.controller('RecipeListCtrl', ['$scope', '$q', 'apiClient', function($scope, $q, apiClient) {

	apiClient.requestMany(apiClient.getRecipes('category'), apiClient.getMetainfoKeys()).then(function(results) {
		$scope.categories = results[0];

		$scope.groupKeys = results[1].map(function(key) {
			return {
				display: key.capitalize(),
				value: key
			};
		});
		$scope.selectedGrouping = $scope.groupKeys[0];
	}, function() {
		$scope.showErrorAlert = true;
	});

	$scope.updateRecipeGrouping = function() {
		apiClient.getRecipes($scope.selectedGrouping.value).then(function(categories) {
			$scope.categories = categories;
		});
	};
}]);
