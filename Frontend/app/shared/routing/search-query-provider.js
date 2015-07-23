recipeRepoServices.service('searchQueryProvider', ['$stateParams', function($stateParams) {
	this.getValue = function() {
		return $stateParams.query || angular.element('#recipe-search').val();
	};
}]);