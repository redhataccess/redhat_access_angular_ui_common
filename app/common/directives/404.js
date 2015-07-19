'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.header').directive('rha404error', function () {
    return {
        templateUrl: 'common/views/404.html',
        restrict: 'A',
        controller: '404'
    };
});
