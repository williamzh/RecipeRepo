//http://weblog.west-wind.com/posts/2015/May/21/Angular-Select-List-Value-not-binding-with-Static-Values
recipeRepoDirectives.directive('modelBinder', ['$log', function($log) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            var type = attrs.modelBinder;

            console.log(type);

            // Inbound binding - parse string values
            ngModel.$parsers.push(function(val) {
                switch(type) {
                    case 'number':
                        return parseInt(val);
                    case 'boolean':
                        return val.toLowerCase() === 'true' ? true : false;
                    default:
                        $log.error('Model binding failed. Unable to parse ' + val + 
                            ' because ' + type + ' is an invalid type.');
                        return val;
                }
                
            });
            // Outbound binding - convert values into strings
            ngModel.$formatters.push(function (val) {
                return (val !== undefined && val !== null) ? val.toString() : '';
            });
        }
    };
}]);