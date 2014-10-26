recipeRepoApp.controller('RecipeListCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('http://localhost:8001/api/recipes?groupBy=category')
		.success(function(result) {
			$scope.categories = result;

			$scope.groupKeys = ['cuisine', 'course', 'meal', 'category'];
			$scope.selectedGrouping = $scope.groupKeys[0];

			$scope.updateRecipeGrouping = function() {
				$http.get('http://localhost:8001/api/recipes?groupBy=' + $scope.selectedGrouping)
					.success(function(result) {
						$scope.categories = result;
					})
					.error(function(error) {
						console.error(error);
					});
			};
		})
		.error(function(error) {
			console.error(error);
		});	
}]);
