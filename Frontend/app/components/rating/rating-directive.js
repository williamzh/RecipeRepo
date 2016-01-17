recipeRepoDirectives.directive('rdRating', function() {
	return {
    	restrict: 'AE',
    	scope: {
    		upCount: '=up',
            downCount: '=down',
            readonly: '=',
            recipeId: '=?'
    	},
    	controller: ['$scope', '$log', 'apiClient', function($scope, $log, apiClient) {
    		$scope.voteUp = function() {
    			if(!$scope.recipeId) {
    				return;
    			}

    			apiClient.rateRecipe($scope.recipeId, true)
	    			.then(function() {
	    				$scope.upCount++;
	    				$log.debug('Upvote successful.');
	    			})
	    			.catch(function() {
	    				$log.error('Upvote failed.');
	    			});
    		};

    		$scope.voteDown = function() {
    			if(!$scope.recipeId) {
    				return;
    			}

    			apiClient.rateRecipe($scope.recipeId, false)
	    			.then(function() {
	    				$scope.downCount++;
	    				$log.debug('Downvote successful.');
	    			})
	    			.catch(function() {
	    				$log.error('Downvote failed.');
	    			});
    		};
    	}],
    	templateUrl: '/app/components/rating/_rating.html'
	};
});