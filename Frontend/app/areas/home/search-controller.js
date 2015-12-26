recipeRepoControllers.controller('searchController', ['$scope', '$q', '$timeout', 'searchQueryProvider', 'apiClient', 'localizationService', function($scope, $q, $timeout, searchQueryProvider, apiClient, localizationService) {
	$scope.searchQuery = searchQueryProvider.getValue();
	$scope.sortDirection = 'asc';
	$scope.showFilters = false;

	if($scope.searchQuery) {
		$q.all([apiClient.searchRecipes($scope.searchQuery), apiClient.getMetainfo()])
			.then(function(responses) {
				$scope.hits = responses[0];
				$scope.readOnlyHits = responses[0];
				$scope.hasSearchHits = $scope.hits.length > 0;

				var metaInfo = responses[1];
				$scope.cuisines = createSelectItems(metaInfo.cuisines);

				$scope.categories = createSelectItems(metaInfo.categories);

				$scope.courses = createSelectItems(metaInfo.courses);
			})
			.catch(function() {
				$scope.hasError = true;
			});
	}

	$scope.sort = function() {
		$scope.sortDirection = $scope.sortDirection === 'asc' ? 'desc' : 'asc';
		$scope.hits = $scope.hits.sortBy(function(h) {
			return h.recipeName;
		}, $scope.sortDirection === 'desc');
	};

	$scope.filter = function() {
		$scope.hits = $scope.readOnlyHits.findAll(function(h) {
			return (!$scope.filteredCuisine || ($scope.filteredCuisine.value === h.meta.cuisine)) &&	// True if filteredCusine not set or is match
				   (!$scope.filteredCategory || ($scope.filteredCategory.value === h.meta.category)) &&	// True if filteredCategory not set or is match
				   (!$scope.filteredCourse || ($scope.filteredCourse.value === h.meta.course));			// True if filteredCourse not set or is match
		});
	};

	function createSelectItems(source) {
		var mappedItems = source.map(function(c) {
			return {
				label: localizationService.translate('metaTags', c), 
				value: c
			};
		});

		return mappedItems; 
	};
}]);