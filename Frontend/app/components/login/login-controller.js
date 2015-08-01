recipeRepoControllers.controller('loginController', ['$scope', '$state', 'apiClient', function($scope, $state, apiClient) {
	$scope.onSubmit = function() {
		apiClient.login($scope.userName, $scope.password)
			.then(function() {
				$state.go('home.start');
			})
			.catch(function() {
				$scope.showError = true;
			});
	};
}]);