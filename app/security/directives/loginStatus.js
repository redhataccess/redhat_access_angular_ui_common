'use strict';
angular.module('RedhatAccess.security').directive('rhaLoginstatus', function () {
    return {
        restrict: 'AE',
        scope: false,
        templateUrl: 'security/views/login_status.html'
    };
});