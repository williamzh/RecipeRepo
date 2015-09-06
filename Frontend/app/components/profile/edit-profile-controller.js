recipeRepoControllers.controller('editPofileController', ['$scope', 'userSession', 'apiClient', function($scope, userSession, apiClient) {
	$scope.init = function() {
		var userName = userSession.get().user.userName;
		apiClient.getUser(userName)
			.then(function(user) {
				$scope.profile = user;
				$scope.fakePassword = '********';
			})
			.catch(function() {
				$scope.showError = true;
			});
	};

	$scope.updateProfile = function() {
		if($scope.editProfileForm.$invalid) {
			return;
		}

		$scope.profileUpdated = false;

		apiClient.updateUser($scope.profile.userName, $scope.profile)
			.then(function() {
				$scope.profileUpdated = true;

				// Reset form
				$scope.editProfileForm.$setPristine();
				$scope.submitted = false;
			})
			.catch(function() {
				$scope.showError = true;
			});
	};

	$scope.hasError = function(field) {
		var isInvalid = $scope.editProfileForm[field].$invalid;
		return ($scope.editProfileForm[field].$dirty && isInvalid) || ($scope.submitted && isInvalid);
	};
}]);