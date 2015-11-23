recipeRepoDirectives.directive('passwordRepeat', ['$log', function ($log) {
    return {
        require: ['ngModel', '^form'],
        link: function (scope, elem, attrs, ctrls) {
        	var modelCtrl = ctrls[0];
            var formCtrl = ctrls[1];
            
            modelCtrl.$validators.passwordValidator = function (modelValue, viewValue) {
                var e = elem;
                var targetName = attrs.passwordRepeat;

                var field = formCtrl[targetName];
                if (!field) {
                    $log.error('Failed to validate field ' + targetName + '. It must be an accessible element of type input[type="password"] on the page.');
                    return true;
                }

                return field.$viewValue === viewValue;
            };
        }
    };
}]);