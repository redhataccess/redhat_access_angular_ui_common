'use strict';
angular.module('RedhatAccess.header').controller('404', [
    '$scope',
    'securityService',
    'COMMON_CONFIG',
    function ($scope, securityService, COMMON_CONFIG) {
		$scope.COMMON_CONFIG = COMMON_CONFIG;
        $scope.securityService = securityService;
    }
]);
