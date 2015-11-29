recipeRepoControllers.controller('createProfileController', ['$scope', '$state', 'userSession', 'apiClient', function($scope, $state, userSession, apiClient) {
	$scope.init = function() {
		$scope.profile = {};
	};

	$scope.createProfile = function(isFormValid) {
		if(!isFormValid) {
			return;
		}

		apiClient.addUser($scope.profile)
			.then(function() {
				$state.go('register.confirm');
			})
			.catch(function() {
				$scope.showError = true;
			});
	};

	$scope.activate = function() {
		apiClient.login($scope.profile.userName, $scope.profile.password)
			.then(function(sessionData) {
				userSession.initialize(sessionData);
				$state.go('home');
			})
			.catch(function() {
				$scope.showError = true;
			});
	}
}]);