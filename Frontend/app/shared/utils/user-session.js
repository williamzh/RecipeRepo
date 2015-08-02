recipeRepoServices.service('userSession', ['$rootScope', '$sessionStorage', function($rootScope, $sessionStorage) {
	this.isValid = function() {
        return $sessionStorage.authSession && $sessionStorage.authSession.token;
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