recipeRepoServices.service('userSession', ['$rootScope', '$sessionStorage', function($rootScope, $sessionStorage) {
	this.isValid = function() {
        return ($sessionStorage.authSession != undefined) && ($sessionStorage.authSession.token != undefined);
    };

    this.get = function() {
        return $sessionStorage.authSession;
    };

    this.initialize = function(authSession) {
        $sessionStorage.authSession = authSession;
        $rootScope.$broadcast('userSessionInitialized');        
    };

    this.dispose = function() {        
    	delete $sessionStorage.authSession;
        $rootScope.$broadcast('userSessionDisposed');
    };
}]);