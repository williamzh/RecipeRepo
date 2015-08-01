recipeRepoApp.factory('authInterceptor', ['$injector', '$q', 'userSession', function($injector, $q, userSession) {
	return {
        request: function(config) {
            var session = userSession.get();
            if (session && session.token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = session.token;
            }

            return config;
        },
        response: function(response) {
            if(typeof response.data === 'object' && response.data.token) {
                userSession.initialize(response.data);
            }

            return response;
        },
        responseError: function(response) {
            if (response.status === 401) {
            	// Inject manually to avoid circular dependency
                $injector.get('$state').go('login');
                return $q.reject('User session has timed out.');
            }

            return $q.reject(response);
        }
    };
}]);