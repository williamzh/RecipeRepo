recipeRepoControllers.controller('homeController', ['$scope', '$state', function($scope, $state) {
	$scope.forwardSearch = function() {
		$state.go('home.search', { query: $scope.searchQuery });
	};
}]);