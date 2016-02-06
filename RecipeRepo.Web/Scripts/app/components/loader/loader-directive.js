recipeRepoDirectives.directive('loader', function () {
    return {
        restrict: 'AE',
        scope: {
            isVisible: '=',
            isInline: '=',
            delayMillis: '=?'
        },
        controller: ['$scope', '$timeout', function ($scope, $timeout) {
            if (!$scope.delayMillis) {
                $scope.delayComplete = true;
                return;
            }

            $scope.delayComplete = false;

            $timeout(function() {
                $scope.delayComplete = true;
            }, $scope.delayMillis);
        }],
        templateUrl: '/Scripts/app/components/loader/_loader.html'
    };
});