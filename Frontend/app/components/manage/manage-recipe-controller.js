recipeRepoControllers.controller('manageRecipeController', ['$scope', '$q', '$stateParams', 'apiClient', 'localizationService', 'log', function($scope, $q, $stateParams, apiClient, localizationService, log) {
	$scope.recipeId = $stateParams.recipeId;
	$scope.inEditMode = $stateParams.recipeId != undefined;
	$scope.currentRecipe = {
		meta: {}
	};
	
	$scope.init = function() {
		var initPromises = [apiClient.getMetainfo()];

		if($scope.inEditMode) {
			initPromises.push(apiClient.getRecipe($scope.recipeId));
		}

		$q.all(initPromises)
			.then(function(responses) {
				var metaInfo = responses[0];
				var recipe = responses[1];

				if(recipe) {
					$scope.currentRecipe = recipe;
				}
				
				$scope.cuisines = metaInfo.cuisines;
				$scope.currentRecipe.meta.cuisine = $scope.cuisines[0];

				$scope.categories = metaInfo.categories;
				$scope.currentRecipe.meta.category = $scope.categories[0];

				$scope.courses = metaInfo.courses;
				$scope.currentRecipe.meta.course = $scope.courses[0];
			})
			.catch(function() {
				$scope.hasError = true;
			});
	}

	$scope.getMetaLabel = function(value) {
		return localizationService.translate('metaTags', value);
	};

	$scope.removeRow = function(index, model) {
		model.splice(index, 1);
	};

	$scope.insertRow = function(index, model, initValue) {
		model.splice(index + 1, 0, initValue);
	};

	$scope.onSubmit = function() {
		if(recipeForm.$invalid) {
			return;
		}

		if(!$scope.inEditMode) {
			apiClient.addRecipe($scope.currentRecipe)
				.then(function() {
					$scope.recipeCreated = true;
				})
				.catch(function() {
					$scope.showError = true;
					// Reset form
					$scope.recipeForm.$setPristine();
					$scope.submitted = false;
					$scope.currentRecipe = {
						ingredients: [{}],
						method: [{}]
					};
				});
		}
		else {
			apiClient.updateRecipe($scope.currentRecipe)
				.then(function() {
					$scope.recipeUpdated = true;
				})
				.catch(function() {
					$scope.showError = true;
				});
		}
	};

	$scope.hasError = function(field) {
		var isInvalid = $scope.recipeForm[field].$invalid;
		return ($scope.recipeForm[field].$dirty && isInvalid) || ($scope.submitted && isInvalid);
	};
}]);