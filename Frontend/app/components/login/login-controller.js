recipeRepoControllers.controller('loginController', ['$scope', '$state', 'apiClient', function($scope, $state, apiClient) {
	$scope.onSubmit = function() {
		apiClient.login($scope.userName, $scope.password)
			.then(function() {
				$state.go('home.start');
			})
			.catch(function(err) {
				console.log(err);
				$scope.showError = true;
			});
	};
}]);