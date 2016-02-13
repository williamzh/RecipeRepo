recipeRepoControllers.controller('resetPasswordController', ['$scope', '$state', 'apiClient', function ($scope, $state, apiClient) {
    $scope.isBusy = false;
    $scope.profile = {};

    $scope.verifyUserName = function () {
	    if ($scope.verifyUserNameForm.$invalid) {
			return;
		}

        $scope.isBusy = true;

        apiClient.verifyUser($scope.profile.userName)
            .then(function() {
                return $state.go('resetPassword.step2');
            })
            .catch(function(err) {
                $scope.errorMsg = err.message;
            })
            .finally(function() {
                $scope.isBusy = false;
            });
    };

    $scope.verifyPhone = function () {
        if ($scope.verifyPhoneForm.$invalid) {
            return;
        }

        $scope.isBusy = true;

        apiClient.verifyPhone($scope.profile.phoneNumber)
            .then(function () {
                return $state.go('resetPassword.step3');
            })
            .catch(function (err) {
                $scope.errorMsg = err.message;
            })
            .finally(function () {
                $scope.isBusy = false;
            });
    };
}]);