recipeRepoControllers.controller('loginController', ['$scope', '$state', 'apiClient', function($scope, $state, apiClient) {
	$scope.onSubmit = function() {
		if($scope.loginForm.$invalid) {
			return;
		}

		apiClient.login($scope.userName, $scope.password)
			.then(function() {
				$state.go('home.start');
			})
			.catch(function(err) {
				console.log(err);
				$scope.showError = true;
			});
	};

	$scope.hasError = function(field) {
		var isInvalid = $scope.loginForm[field].$invalid;
		return ($scope.loginForm[field].$dirty && isInvalid) || ($scope.submitted && isInvalid);
	};
}]);