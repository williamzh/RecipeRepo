recipeRepoDirectives.directive('validator', ['$log', function ($log) {
	return {
		restrict: 'A',
		/* 
		* The inherited scope has 2 purposes:
		* - To prevent model leakage when multiple directives on same page
		* - To allow access to properties/functions on the outer scope
		*/
		scope: true,
		require: '^form',
		controller: ['$scope', function($scope, elem, attrs) {
			$scope.hasError = function (fieldName) {
				if (!fieldName) {
					// Validate form if no field name provided
					$log.debug('Fieldname not provided. Validating form ' + $scope.formCtrl.$name + 'instead.');
					return $scope.formCtrl.$invalid;
				}

				var field = $scope.formCtrl[fieldName];
				if (field == undefined) {
					// Ignore fields that doesn't exist
					return false;
				}

				// A field is considered invalid if it has invalid input AND one of the following:
				// - The field is dirty
				// - The form has been submitted, i.e. either if there is a submitted (ancestor) scope variable or a user-provided one.
				var isSubmitted = $scope.customSubmitted === null ? $scope.submitted : $scope[$scope.customSubmitted];
				return (field.$dirty || isSubmitted === true) && field.$invalid;
			};
		}],
		link: function(scope, elem, attrs, formCtrl) {
			scope.formCtrl = formCtrl;
			scope.customSubmitted = attrs.validator === '' ? null : attrs.validator;
		}
	};
}]);