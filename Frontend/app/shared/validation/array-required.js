recipeRepoDirectives.directive('arrayRequired', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl) {
			// Set up a watch on the array length to trigger push/splice, which
			// won't trigger ngModel updates.
			scope.$watch(function () {
				return modelCtrl.$modelValue && modelCtrl.$modelValue.length;
			}, function(newValue, oldValue) {
				// Don't run on startup (only when array actually changes)
				if(newValue !== oldValue) {
					modelCtrl.$validate();
				}
			});

			modelCtrl.$validators.arrayLength = function(modelValue) {
				if(!modelValue) {
					return false;
				}

				return modelValue.length > 0;
			};
		}
	};
});