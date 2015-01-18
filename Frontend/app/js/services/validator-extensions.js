recipeRepoServices.service('validatorExtensions', ['log', function(log) {
	this.validateArray = function(array, validateObjects) {
		if(!Array.isArray(array)) {
			log.debug('Validate array: ' + array + ' + is not an array.');
			return false;
		}

		if(array.length <= 0) {
			return false;
		}

		var arrayType = typeof array.pop();		// Assume all items have the same type
		if(arrayType !== "object" && !validateObjects) {
			return true;
		}

		// If the array contains objects, we must also check if the object themselves are valid.
		for(var i = 0; i < array.length; i++) {
			var obj = array[i];
			for(var key in obj) {
				if(!obj[key]) {
					return false;
				}
			}
		}

		return true;
	};
}]);