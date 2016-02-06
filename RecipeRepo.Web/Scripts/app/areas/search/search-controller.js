recipeRepoControllers.controller('searchController', ['$scope', '$stateParams', 'apiClient', function($scope, $stateParams, apiClient) {
	$scope.searchQuery = $stateParams.query;

	$scope.search = function() {
		if(!$scope.searchQuery) {
			return;
		}

		$scope.isBusy = true;
	    $scope.hits = [];

		apiClient.searchRecipes($scope.searchQuery)
			.then(function(hits) {
				$scope.hits = hits;
				$scope.errorMsg = false;
			})
			.catch(function(err) {
				$scope.errorMsg = err.message;
			})
	        .finally(function() {
		        $scope.isBusy = false;
		    });
	}
}]);