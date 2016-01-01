recipeRepoControllers.controller('manageRecipeController', ['$scope', '$q', '$log', '$stateParams', 'apiClient', 'localizationService', function($scope, $q, $log, $stateParams, apiClient, localizationService) {
	$scope.recipeId = $stateParams.recipeId;
	$scope.inEditMode = $stateParams.recipeId != undefined;
	$scope.currentRecipe = {};
	$scope.submitted = false;

	$scope.newIngredient = {};
	$scope.ingredientModalSubmitted = false;

	$scope.newStep = {};	// Use an object, since Angular doesn't handle model binding with strings very well
	$scope.stepModalSubmitted = false;
	
	$scope.init = function() {
		var initPromises = [apiClient.getMetainfo()];

		if($scope.inEditMode) {
			initPromises.push(apiClient.getRecipe($scope.recipeId));
		}

		$q.all(initPromises)
			.then(function(responses) {
				var allMetaInfo = responses[0];
				var recipe = responses[1];

				if(recipe) {
					$scope.currentRecipe = recipe;
				}

				$scope.currentRecipe.meta = {};
				
				$scope.cuisines = getMetaInfoValues('cuisines', allMetaInfo);
				$scope.currentRecipe.meta.cuisine = $scope.cuisines[0];

				$scope.categories = getMetaInfoValues('categories', allMetaInfo);
				$scope.currentRecipe.meta.category = $scope.categories[0];

				$scope.courses = getMetaInfoValues('courses', allMetaInfo);
				$scope.currentRecipe.meta.course = $scope.courses[0];
			})
			.catch(function(error) {
				$scope.showError = true;
				$scope.errorMessage = localizationService.translate('manage', error.message);
			});
	};

	$scope.showIngredientModal = function(ingredient) {
		if(ingredient) {
			$scope.newIngredient = ingredient;
		}

		$scope.ingredientModalVisible = true;
	};

	$scope.addIngredient = function(form) {
		$scope.ingredientModalSubmitted = true;

		if(form.$invalid) {
			return;
		}

		if($scope.currentRecipe.ingredients === undefined) {
			$scope.currentRecipe.ingredients = [];
		}

		// Check if the ingredient already exists
		var index = $scope.currentRecipe.ingredients.findIndex(function(ing) {
			return ing.name === $scope.newIngredient.name;
		});

		if(index > -1) {
			$scope.currentRecipe.ingredients.removeAt(index);
			$scope.currentRecipe.ingredients.insert($scope.newIngredient, index);
		}
		else {
			$scope.currentRecipe.ingredients.push($scope.newIngredient);
		}

		$scope.newIngredient = {};
		form.$setPristine();
		form.$setUntouched();
		$scope.ingredientModalSubmitted = false;

		$scope.ingredientModalVisible = false;
	};

	$scope.removeIngredient = function(index) {
		$scope.currentRecipe.ingredients.splice(index, 1);
	};

	$scope.showStepModal = function(step) {
		if(step) {
			$scope.newStep.value = step;
		}

		$scope.stepModalVisible = true;
	};

	$scope.addStep = function(form) {
		$scope.stepModalSubmitted = true;

		if(form.$invalid) {
			return;
		}

		if($scope.currentRecipe.steps === undefined) {
			$scope.currentRecipe.steps = [];
		}

		// Check if the ingredient already exists
		var index = $scope.currentRecipe.steps.findIndex(function(step) {
			return step === $scope.newStep.value;
		});

		if(index > -1) {
			$scope.currentRecipe.steps.removeAt(index);
			$scope.currentRecipe.steps.insert($scope.newStep.value, index);
		}
		else {
			$scope.currentRecipe.steps.push($scope.newStep.value);
		}

		$scope.newStep = {};
		form.$setPristine();
		form.$setUntouched();
		$scope.stepModalSubmitted = false;

		$scope.stepModalVisible = false;
	};

	$scope.removeStep = function(index) {
		$scope.currentRecipe.steps.splice(index, 1);
	};

	$scope.onSubmit = function() {
		$scope.showError = false;

		if($scope.recipeForm.$invalid) {
			return;
		}

		console.log($scope.currentRecipe);

		if(!$scope.inEditMode) {
			$scope.recipeCreated = false;

			apiClient.addRecipe($scope.currentRecipe)
				.then(function() {
					$scope.recipeCreated = true;

					// Reset form
					$scope.recipeForm.$setPristine();
					$scope.submitted = false;
					$scope.currentRecipe = {};
				})
				.catch(function() {
					$scope.errorMessage = localizationService.translate('global', 'generalErrorMessage');
					$scope.showError = true;
				});
		}
		else {
			$scope.recipeUpdated = false;

			// apiClient.updateRecipe($scope.currentRecipe)
			// 	.then(function() {
			// 		$scope.recipeUpdated = true;
			// 		$scope.submitted = false;
			// 	})
			// 	.catch(function() {
			// 		$scope.showError = true;
			// 	});
		}
	};

	function getMetaInfoValues(metaInfoObjName, allMetaInfo) {
		var metaInfoObj = allMetaInfo.find(function(m) { return m.name === metaInfoObjName });

		if(!metaInfoObj || !metaInfoObj.values.length) {
			$log.error('Failed to initalize form. No meta info object for ' + metaInfoObjName + ' has been defined.');
			throw new Error('formInitError' + metaInfoObjName.capitalize());
		}
		
		$log.debug('Mapped meta info for ' + metaInfoObjName);
		return metaInfoObj.values;		
	}
}]);