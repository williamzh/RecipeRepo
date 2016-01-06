recipeRepoControllers.controller('manageRecipeController', ['$scope', '$q', '$log', '$stateParams', 'apiClient', 'localizationService', 'idGenerator',
	function($scope, $q, $log, $stateParams, apiClient, localizationService, idGenerator) {
	
	$scope.recipeId = $stateParams.recipeId;
	$scope.inEditMode = $stateParams.recipeId != undefined;

	$scope.currentRecipe = {
		meta: {}
	};
	$scope.submitted = false;

	$scope.newIngredient = {};
	$scope.ingredientModalSubmitted = false;

	$scope.newStep = {};
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

					// Convert the steps string array into an object array so that each step is
					// uniquely identifiable.
					$scope.currentRecipe.steps.each(function(s, index) {
						$scope.currentRecipe.steps[index] = { id: index + 1, value: s }
					});
				}

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
		$scope.newIngredient = ingredient || {};

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
		$scope.newStep = step || {};

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

		// Check if the step already exists
		var index = $scope.currentRecipe.steps.findIndex(function(step) {
			return step.id === $scope.newStep.id;
		});

		if(index > -1) {
			$scope.currentRecipe.steps.removeAt(index);
			$scope.currentRecipe.steps.insert($scope.newStep, index);
		}
		else {
			$scope.newStep.id = idGenerator.sequentialId($scope.currentRecipe.steps.map(function(s) { return s.id; }));
			$scope.currentRecipe.steps.push($scope.newStep);
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

		// Convert steps back into a string collection
		$scope.currentRecipe.steps = $scope.currentRecipe.steps.map(function(s) { return s.value; });

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

			apiClient.updateRecipe($scope.currentRecipe)
				.then(function() {
					$scope.recipeUpdated = true;
					$scope.submitted = false;
				})
				.catch(function() {
					$scope.showError = true;
				});
		}
	};

	function getMetaInfoValues(metaInfoObjName, allMetaInfo) {
		var metaInfoObj = allMetaInfo.find(function(m) { return m.name === metaInfoObjName });

		if(!metaInfoObj || !metaInfoObj.values.length) {
			$log.error('Failed to initalize form. No meta info object for ' + metaInfoObjName + ' has been defined.');
			throw new Error('formInitError' + metaInfoObjName.capitalize());
		}
		
		return metaInfoObj.values;		
	}
}]);