'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.header').directive('rha403error', function () {
    return {
        templateUrl: 'common/views/403.html',
        restrict: 'A',
        controller: '403'
    };
});
