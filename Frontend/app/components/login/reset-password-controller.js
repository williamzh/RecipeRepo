recipeRepoControllers.controller('resetPasswordController', ['$scope', '$state', 'apiClient', function($scope, $state, apiClient) {
	$scope.onSubmit = function() {
		if($scope.resetPasswordForm.$invalid) {
			return;
		}

		// apiClient.resetPassword($scope.userName, $scope.password)
		// 	.then(function() {
		// 		$state.go('home.start');
		// 	})
		// 	.catch(function(err) {
		// 		console.log(err);
		// 		$scope.showError = true;
		// 	});
	};
}]);