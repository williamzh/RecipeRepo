recipeRepoControllers.controller('loginController', ['$scope', '$state', 'userSession', 'apiClient', function($scope, $state, userSession, apiClient) {
	$scope.userName = '';
	$scope.password = '';
    $scope.isBusy = false;

    $scope.onSubmit = function () {
        $scope.isBusy = true;
		$scope.showError = false;
		
		if($scope.loginForm.$invalid) {
			return;
		}

		apiClient.login($scope.userName, $scope.password)
			.then(function(authResponse) {
				userSession.initialize(authResponse);

				return $state.go('home');
			})
			.catch(function() {
				$scope.showError = true;
			})
            .finally(function() {
		        $scope.isBusy = false;
		    });
	};
}]);