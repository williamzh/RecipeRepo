recipeRepoApp.directive('rdRating', function() {
  return {
    restrict: 'A',
    scope: {
      rating: '@'
    },
    controller: ['$scope', function($scope) {
    	var maxStars = 5;

    	var fullStars = Math.floor($scope.rating);
    	var hasHalfStar = ($scope.rating - fullStars) > 0;

    	var starClasses = [];
    	for(var i = 0; i < maxStars; i++) {
    		if(i < fullStars) {
    			starClasses.push('star');
    		}
    		else if(hasHalfStar) {
    			starClasses.push('star-half-full');
    		}
    		else {
    			starClasses.push('star-o');
    		}
    	}

    	$scope.starClasses = starClasses;
    }],
    template: '<span ng-repeat="starClass in starClasses track by $index" class="fa fa-{{starClass}}">'
  }
});