recipeRepoControllers.controller('manageRecipeController', ['$scope', '$q', '$stateParams', 'apiClient', 'log', function($scope, $q, $stateParams, apiClient, log) {
	$scope.recipeId = $stateParams.recipeId;
	$scope.inEditMode = $stateParams.recipeId != undefined;
	$scope.currentRecipe = {
		ingredients: [{}],
		method: [{}]
	};
	$scope.previousState = $scope.inEditMode ? 'recipe' : 'home.topList';
	
	$scope.init = function() {
		var initPromises = [apiClient.getMetainfo()];

		if($scope.inEditMode) {
			initPromises.push(apiClient.getRecipe($scope.recipeId));
		}

		$q.all(initPromises)
			.then(function(responses) {
				var metainfo = responses[0];
				var recipe = responses[1];

				if(recipe) {
					$scope.recipe = fillData(recipe);
				}

				// var cuisineMeta = metainfo['cuisine'];
				// $scope.cuisines = cuisineMeta ? cuisineMeta.values : [];
				
				// var categoryMeta = metainfo['category'];
				// $scope.categories = categoryMeta ? categoryMeta.values : [];
			})
			.catch(function() {
				$scope.hasError = true;
			});
	}

	$scope.removeRow = function(index, model) {
		model.splice(index, 1);
	};

	$scope.insertRowBelow = function(index, model) {
		model.splice(index + 1, 0, {});
	};

	$scope.onSubmit = function(isValid) {
		if(!isValid) {
			return;
		}

		if(!$scope.inEditMode) {
			var recipe = formatData();
			
			apiClient.addRecipe(recipe)
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
			var updatedRecipe = formatData();
			updatedRecipe.id = $scope.recipeId;

			apiClient.updateRecipe(updatedRecipe)
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

	function fillData(recipe) {
		$scope.currentRecipe.name = recipe.recipeName;
		$scope.currentRecipe.description = recipe.description;
		$scope.currentRecipe.imagePath = recipe.imagePath;
		$scope.currentRecipe.servings = recipe.servingSize;
		$scope.currentRecipe.isFavorite = recipe.isFavorite;
		$scope.currentRecipe.rating = recipe.rating;
		$scope.currentRecipe.ingredients = recipe.ingredients;
		$scope.currentRecipe.method = recipe.method.map(function(step) { return { value: step } });
		$scope.currentRecipe.cuisine = recipe.meta.cuisine;
		$scope.currentRecipe.category = recipe.meta.category;
	}

	function formatData() {
		return {
			recipeName: $scope.currentRecipe.name,
			description: $scope.currentRecipe.description || '',
			imagePath: $scope.currentRecipe.imagePath || '',
			servingSize: $scope.currentRecipe.servings,
			isFavorite: $scope.currentRecipe.isFavorite || false,
			rating: $scope.currentRecipe.rating,
			ingredients: $scope.currentRecipe.ingredients.map(function(ing) { 
				return {
					// Remap to exclude angular properties
					name: ing.name,
					quantity: ing.quantity,
					unit: ing.unit,
					component: ing.component
				};
			}),
			method: $scope.currentRecipe.method.map(function(step) {
				return step.value;
			}),
			meta: {
			  cuisine: $scope.currentRecipe.cuisine,
			  category: $scope.currentRecipe.category,
			}
		};
	}
}]);