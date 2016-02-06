recipeRepoControllers.controller('manageRecipeController', ['$scope', '$q', '$log', '$stateParams', 'Upload', 'apiClient', 'localizationService', 'idGenerator',
	function($scope, $q, $log, $stateParams, Upload, apiClient, localizationService, idGenerator) {
	
	$scope.recipeId = $stateParams.recipeId;
	$scope.inEditMode = $stateParams.recipeId != undefined;

	$scope.currentRecipe = {
		meta: {}
	};
	$scope.currentSteps = [];

	$scope.isBusy = false;
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

		$scope.isBusy = true;
		$q.all(initPromises)
			.then(function(responses) {
				var allMetaInfo = responses[0];
				var recipe = responses[1];

				$scope.cuisines = getMetaInfoValues('cuisines', allMetaInfo);
				$scope.categories = getMetaInfoValues('categories', allMetaInfo);
				$scope.courses = getMetaInfoValues('courses', allMetaInfo);

		        if (recipe) {
		            $scope.currentRecipe = recipe;

		            // Map the steps string array to a temporary object array so that each step is
		            // uniquely identifiable.
		            var i = 0;
		            $scope.currentSteps = $scope.currentRecipe.steps.map(function(s) {
		                return {
		                    id: i++,
		                    value: s
		                };
		            });

		            $scope.currentImageName = $scope.currentImage ?
		                $scope.currentRecipe.imageUrl.substring($scope.currentRecipe.imageUrl.lastIndexOf('/') + 1) :
		                '';
		        }
		        else {
		            $scope.currentRecipe.meta.cuisine = $scope.cuisines[0];
		            $scope.currentRecipe.meta.category = $scope.categories[0];
		            $scope.currentRecipe.meta.course = $scope.courses[0];
		        }
		    })
			.catch(function(error) {
				$scope.showError = true;
				$scope.errorMessage = localizationService.translate('manage', error.message);
			})
			.finally(function() {
				$scope.isBusy = false;
			});
	};

	$scope.setImage = function(file, errors) {
		$scope.currentImage = file;

		var uploadError = errors && errors[0];

        if(uploadError) {
        	switch(uploadError.$error) {
        		case 'maxSize':
        			$scope.uploadValidationMessage = localizationService.translate('validation', 'imageUploadSizeExceeded');
        			break;
    			case 'pattern':
    				$scope.uploadValidationMessage = localizationService.translate('validation', 'imageUploadFormat');
        			break;
			}

			return;
        }

        $scope.uploadValidationMessage = null;
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

		// Check if the step already exists
		var index = $scope.currentSteps.findIndex(function(step) {
			return step.id === $scope.newStep.id;
		});

		if(index > -1) {
			$scope.currentSteps.removeAt(index);
			$scope.currentSteps.insert($scope.newStep, index);
		}
		else {
			$scope.newStep.id = idGenerator.sequentialId($scope.currentSteps.map(function(s) { return s.id; }));
			$scope.currentSteps.push($scope.newStep);
		}

		$scope.newStep = {};
		form.$setPristine();
		form.$setUntouched();
		$scope.stepModalSubmitted = false;

		$scope.stepModalVisible = false;
	};

	$scope.removeStep = function(index) {
		$scope.currentSteps.splice(index, 1);
	};

	$scope.onSubmit = function() {
		$scope.showError = false;

		if($scope.recipeForm.$invalid) {
			return;
		}

		$scope.isBusy = true;

		// Convert steps back into a string collection
		$scope.currentRecipe.steps = $scope.currentSteps.map(function(s) { return s.value; });

		if($scope.inEditMode) {
			$scope.recipeUpdated = false;
			
			Upload.upload({ url: '/upload/image', data: { file: $scope.currentImage } })
		        .then(function (response) {
		        	if(response.data.path) {
			            $scope.currentRecipe.imageUrl = response.data.path;
			        }

		            return apiClient.updateRecipe($scope.currentRecipe);
		        })
				.then(function() {
					$scope.recipeUpdated = true;
					$scope.submitted = false;
				})
				.catch(function() {
					$scope.showError = true;
				})
				.finally(function() {
					$scope.isBusy = false;
				});
		}
		else {
			$scope.recipeCreated = false;

			Upload.upload({ url: '/upload/image', data: { file: $scope.currentImage } })
		        .then(function (response) {
		            if(response.data.path) {
			            $scope.currentRecipe.imageUrl = response.data.path;
			        }

		            return apiClient.addRecipe($scope.currentRecipe);
		        })
				.then(function() {
					$scope.recipeCreated = true;

					// Reset form
					$scope.recipeForm.$setPristine();
					$scope.submitted = false;
					$scope.currentRecipe = {};
			        $scope.currentSteps = [];
			    })
				.catch(function() {
					$scope.errorMessage = localizationService.translate('global', 'generalErrorMessage');
					$scope.showError = true;
				})
				.finally(function() {
					$scope.isBusy = false;
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