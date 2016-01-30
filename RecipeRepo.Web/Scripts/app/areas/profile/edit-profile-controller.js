recipeRepoControllers.controller('editProfileController', ['$scope', '$q', 'apiClient', function($scope, $q, apiClient) {
	$scope.profile = {};

	$scope.init = function () {
	    $scope.isBusy = true;

		$q.all([apiClient.getUser(), apiClient.getLanguages()])
			.then(function(responses) {
				$scope.profile = responses[0];
				$scope.fakePassword = '********';

				$scope.supportedLanguages = responses[1];
				$scope.selectedLang = $scope.supportedLanguages[0];
			})
			.catch(function() {
				$scope.showError = true;
			})
	        .finally(function() {
		        $scope.isBusy = false;
		    });
	};

	$scope.updateProfile = function() {
		if($scope.editProfileForm.$invalid) {
			return;
		}

		$scope.profileUpdated = false;

		apiClient.updateUser($scope.profile)
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
}]);