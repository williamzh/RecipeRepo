recipeRepoDirectives.directive('rdModal', ['$window', function($window) {
	return {
    	restrict: 'E',
    	transclude: true,
    	scope: {
    		type: '@',
    		targetId: '@',
    		modalHeader: '@',
    		actionLabel: '@?',
    		onAction: '&?'
    	},
		controller: ['$scope', function($scope) {
			$scope.actionInvoking = false;

			$scope.invokeAction = function() {
				$scope.actionInvoking = true;
				$scope.onAction();
			};
		}],
		link: function(scope, elem) {
			var unwatch = scope.$watch('actionInvoking', function(newValue) {
				if(newValue === true) {
					$('#' + scope.targetId).modal('hide');
					unwatch();
				}
			});
		 },
    	templateUrl: '/app/shared/modal/_modal.html'
	};
}]);