recipeRepoServices.service('idGenerator', ['$log', function($log) {
	this.sequentialId = function(existingIds) {
		var i = 0;
		var id = 1;
		while(id === existingIds[i]) {
			id++;
			i++;

			if(i >= 10000) {
				$log.error('Max iterations (10000) reached. Aborting...');
				return -1;
			}
		}
		
		return id;
	};
}]);