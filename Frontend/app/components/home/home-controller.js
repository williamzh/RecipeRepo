recipeRepoControllers.controller('homeController', ['$scope', '$state', function($scope, $state) {
	$scope.search = function() {
		$state.go('home.search', { query: $scope.searchQuery });
	};
}]);