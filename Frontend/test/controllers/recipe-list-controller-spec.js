describe('Provided a RecipeListController', function() {
	var $controller, $q, apiClient, $scope, $rootScope;

	beforeEach(function() {
		module('recipeRepoServices');
		module('recipeRepoControllers');

		inject(function(_$controller_, _$q_, _apiClient_, _$rootScope_) {
			$controller = _$controller_;
			$q = _$q_;
			apiClient = _apiClient_;
			$rootScope = _$rootScope_;
		});

		$scope = {};
	});

	describe('on initialization', function() {
		beforeEach(function() {
			var recipesDefer = $q.defer();
			recipesDefer.resolve({
				"Meat": [{
				  "id": 8
				}],
				"Pasta": [{
				  "id": 4
				}]
			});
			spyOn(apiClient, 'getRecipes').and.returnValue(recipesDefer.promise);

			var metainfoDefer = $q.defer();
			metainfoDefer.resolve(['category', 'cuisine']);
			spyOn(apiClient, 'getMetainfoKeys').and.returnValue(metainfoDefer.promise);

			controller = $controller('RecipeListCtrl', { 
				$scope: $scope,
				apiClient: apiClient
			});
		});

		it('should set recipes', function(done) {
			$rootScope.$apply();	// Resolve promises
			expect($scope.categories['Meat'][0].id).toEqual(8);
			expect($scope.categories['Pasta'][0].id).toEqual(4);
			done();
		});

		it('should set group keys', function(done) {
			$rootScope.$apply();
			expect($scope.groupKeys).toEqual([
				{ display: 'Category', value: 'category' },
				{ display: 'Cuisine', value: 'cuisine' }
			]);
			done();
		});

		it('should set a default grouping', function(done) {
			$rootScope.$apply();
			expect($scope.selectedGrouping).not.toBe(undefined);
			done();
		});
	});
});