recipeRepoControllers.controller('profileController', ['$scope', 'userSession', 'apiClient', function($scope, userSession, apiClient) {
	$scope.init = function() {
		var userName = userSession.get().user.userName;
		apiClient.getUser(userName)
			.then(function(user) {
				$scope.profile = user;
			})
			.catch(function() {
				$scope.showError = true;
			});
	};
}]);