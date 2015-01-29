recipeRepoControllers.controller('ManageRecipeCtrl', ['$scope', '$routeParams', 'apiClient', 'validatorExtensions', 'log', 
	function($scope, $routeParams, apiClient, validatorExtensions, log) {

	$scope.ingredients = [{}];
	$scope.method = [{}];
	$scope.mode = 'create';

	$scope.alerts = {
		'created': { type: 'success', msg: 'Recipe successfully created.' },
		'updated': { type: 'success', msg: 'Recipe successfully updated.' },
		'error': { type: 'danger', msg: 'Oh snap, an unexpected error occured. Please contact [responsible person here].' }
	};

	apiClient.requestMany(apiClient.getMetainfoValues('cuisine'), apiClient.getMetainfoValues('category')).then(function(results) {
		$scope.cuisines = results[0];
		$scope.categories = results[1];

		if($routeParams.recipeId) {
			$scope.mode = 'edit';
			apiClient.getRecipe($routeParams.recipeId).then(function(recipe) {
				fillData(recipe);
			});
		}
	});

	$scope.removeRow = function(index, model) {
		model.splice(index, 1);
	};

	$scope.insertRowBelow = function(index, model) {
		model.splice(index + 1, 0, {});
	};

	$scope.onSubmit = function(isValid) {
		// if(isValid) {
		// 	var recipe = formatData();
		// 	if($scope.mode == 'create') {
		// 		apiClient.addRecipe(recipe).then(function() {
		// 			$scope.activeAlert = 'created';
		// 			// TODO: auto scroll to top? http://stackoverflow.com/questions/17284005/scrollto-function-in-angularjs
		// 		}, function() {
		// 			$scope.activeAlert = 'error';
		// 		});
		// 	}
		// 	else if($scope.mode == 'edit') {
		// 		var updatedRecipe = formatData();
		// 		updatedRecipe.id = $routeParams.recipeId;

		// 		apiClient.updateRecipe(updatedRecipe).then(function() {
		// 			$scope.activeAlert = 'updated';
		// 		}, function() {
		// 			$scope.activeAlert = 'error';
		// 		});
		// 	}
		// 	else {
		// 		log.errorFormat('Failed to create or update recipe. Unknown mode {1}.', $scope.mode);
		// 	}
		// }
	};

	$scope.hasError = function(field, customRule) {
		console.log(field);
		
		var isInvalid = true;
		if(!customRule) {
			isInvalid = $scope.recipeForm[field].$invalid;
			return ($scope.recipeForm[field].$dirty && isInvalid) || ($scope.submitted && isInvalid);
		}

		
 		switch(customRule) {
 			case 'collectionRequired':	
 				isInvalid = true; //validatorExtensions.validateArray($scope[field]);
 				break;
 		}

 		return isInvalid && $scope.submitted;
	};

	function fillData(recipe) {
		$scope.name = recipe.recipeName;
		$scope.description = recipe.description;
		$scope.imagePath = recipe.imagePath;
		$scope.servings = recipe.servingSize;
		$scope.isFavorite = recipe.isFavorite;
		$scope.ingredients = recipe.ingredients;
		$scope.method = recipe.method.map(function(step) { return { value: step } });
		$scope.cuisine = recipe.meta.cuisine;
		$scope.category = recipe.meta.category;
		$scope.rating = recipe.meta.rating;
	}

	function formatData() {
		return {
			recipeName: $scope.name,
			description: $scope.description,
			imagePath: $scope.imagePath,
			servingSize: $scope.servings,
			isFavorite: $scope.isFavorite || false,
			ingredients: $scope.ingredients.map(function(ing) { 
				return {
					name: ing.name,
					quantity: ing.quantity,
					unit: ing.unit
				};
			}),
			method: $scope.method.map(function(step) {
				return step.value;
			}),
			meta: {
			  cuisine: $scope.cuisine,
			  //course: "Main",
			  category: $scope.category,
			  rating: $scope.rating
			}
		};
	}
}]);