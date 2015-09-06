recipeRepoControllers.controller('createProfileController', ['$scope', '$state', 'userSession', 'apiClient', function($scope, $state, userSession, apiClient) {
	$scope.init = function() {
		
	};

	$scope.createProfile = function() {
		if($scope.createProfileForm.$invalid) {
			return;
		}

		apiClient.addUser($scope.profile)
			.then(function() {
				// Automatically authenticate the user for first-time login
				return apiClient.login($scope.profile.userName, $scope.profile.password);
			})
			.then(function(sessionData) {
				userSession.initialize(sessionData);
				$state.go('register.confirm');
			})
			.catch(function() {
				$scope.showError = true;
			});
	};

	$scope.hasError = function(field) {
		var isInvalid = $scope.createProfileForm[field].$invalid;
		return ($scope.createProfileForm[field].$dirty && isInvalid) || ($scope.submitted && isInvalid);
	};
}]);