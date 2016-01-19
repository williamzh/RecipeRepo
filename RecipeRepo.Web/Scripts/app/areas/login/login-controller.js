recipeRepoControllers.controller('loginController', ['$scope', '$state', 'userSession', 'apiClient', function($scope, $state, userSession, apiClient) {
	$scope.userName = '';
	$scope.password = '';

	$scope.onSubmit = function() {
		$scope.showError = false;
		
		if($scope.loginForm.$invalid) {
			return;
		}

		apiClient.login($scope.userName, $scope.password)
			.then(function(authResponse) {
				userSession.initialize(authResponse);

				$state.go('home');
			})
			.catch(function(err) {
				$scope.showError = true;
			});
	};
}]);