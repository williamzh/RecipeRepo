recipeRepoControllers.controller('loginController', ['$scope', '$state', 'userSession', 'apiClient', function($scope, $state, userSession, apiClient) {
	$scope.onSubmit = function() {
		if($scope.loginForm.$invalid) {
			return;
		}

		apiClient.login($scope.userName, $scope.password)
			.then(function(sessionData) {
				userSession.initialize(sessionData);
				$state.go('home.start');
			})
			.catch(function(err) {
				$scope.showError = true;
			});
	};

	$scope.hasError = function(field) {
		var isInvalid = $scope.loginForm[field].$invalid;
		return ($scope.loginForm[field].$dirty && isInvalid) || ($scope.submitted && isInvalid);
	}
}]);