recipeRepoServices.service('log', ['$log', function($log) {
	this.info = function(message) {
		$log.info(message);
	};

	this.warn = function(message) {
		$log.warn(message);
	};

	this.error = function(message) {
		if(typeof message === "string") {
			$log.error(message);
		}
		else {
			$log.error('Cannot log error - illegal message type.');
		}
	};

	this.debug = function(message) {
		$log.debug(message);
	};
}]);