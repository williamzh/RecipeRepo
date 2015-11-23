recipeRepoDirectives.directive('validator', ['$log', function ($log) {
	return {
		restrict: 'A',
		scope: true,	// Create inherited scope to prevent model leakage when multiple directives on same page
		require: '^form',
		controller: ['$scope', function($scope) {
			$scope.hasError = function (fieldName) {
				if (!fieldName) {
					// Validate form if no field name provided
					$log.debug('Fieldname not provided. Validating form ' + $scope.formCtrl.$name + 'instead.');
					return $scope.formCtrl.$invalid;
				}

				var field = $scope.formCtrl[fieldName];
				if (!field) {
					// Ignore fields that doesn't exist
					return false;
				}

				return (field.$dirty || $scope.submitted) && field.$invalid;
			};

			// $scope.validateSubmit = function (e) {
			// 	// Prevent form submit if input is invalid
			// 	if ($scope.hasError()) {
			// 		$scope.submitted = true;
			// 		e.preventDefault();
			// 	};
			// }

			// Expose hasError on API interface
			this.hasError = $scope.hasError;
		}],
		link: function(scope, elem, attrs, formCtrl) {
			scope.formCtrl = formCtrl;
		}
	};
}]);