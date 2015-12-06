recipeRepoControllers.controller('editProfileController', ['$scope', 'userSession', 'apiClient', function($scope, userSession, apiClient) {
	$scope.selectedLang = undefined;

	$scope.init = function() {
		var user = userSession.get().user;
		apiClient.getUser(user._id)
			.then(function(user) {
				$scope.profile = user;
				$scope.fakePassword = '********';
			})
			.catch(function() {
				$scope.showError = true;
			});

		$scope.supportedLanguages = [{
			text: 'Swedish',
			value: 'sv-SE'
		}];
		
		// $scope.selectedLang = $scope.supportedLanguages.find(function(lang) { 
		// 	return lang.value === user.settings.language;
		// });

		// console.log($scope.supportedLanguages.find(function(lang) { 
		// 	return lang.value === user.settings.language;
		// }));
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
}]);