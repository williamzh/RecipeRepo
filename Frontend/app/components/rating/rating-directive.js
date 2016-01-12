recipeRepoDirectives.directive('rdRating', [function() {
	return {
    	restrict: 'AE',
    	scope: {
    		rating: '='
    	},
    	controller: ['$scope', function($scope) {
    		$scope.stars = [];

    		var nearestInteger = Math.floor($scope.rating);

    		for(var i = 0; i < nearestInteger; i++) {
				$scope.stars.push({ isHalf: false })
			}

    		if(nearestInteger !== $scope.rating) {
    			$scope.stars.push({ isHalf: true })
    		}
    	}],
    	templateUrl: '/app/components/rating/_rating.html'
	};
}]);