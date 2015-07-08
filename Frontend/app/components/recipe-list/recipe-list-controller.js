recipeRepoControllers.controller('RecipeListCtrl', ['$scope', 'apiClient', function($scope, apiClient) {
	apiClient.requestMany(apiClient.getRecipes('category'), apiClient.getMetaData())
		.then(function(results) {
			$scope.categories = results[0];

			var keysObj = results[1]['category'];
			if(!keysObj) {
				$scope.groupKeys = [];
			}
			else {
				var keys = Object.keys(keysObj.values);
				$scope.groupKeys = keys.map(function(key) {
					return {
						display: key.capitalize(),
						value: key
					};
				});
			}
			
			$scope.selectedGrouping = $scope.groupKeys[0];
		})
		.catch(function() {
			$scope.showErrorAlert = true;
		});

	$scope.updateRecipeGrouping = function() {
		apiClient.getRecipes($scope.selectedGrouping.value).then(function(categories) {
			$scope.categories = categories;
		});
	};
}]);
