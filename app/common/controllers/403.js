'use strict';
angular.module('RedhatAccess.header').controller('403', [
    '$scope',
    'securityService',
    'HeaderService',
    'COMMON_CONFIG',
    function ($scope, securityService, HeaderService, COMMON_CONFIG) {
		$scope.COMMON_CONFIG = COMMON_CONFIG;
        $scope.securityService = securityService;
        $scope.HeaderService = HeaderService;
    }
]);
