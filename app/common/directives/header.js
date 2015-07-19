'use strict';
angular.module('RedhatAccess.header').directive('rhaHeader', function () {
    return {
		templateUrl: 'common/views/header.html',
        restrict: 'A',
        scope: { page: '@' },
        controller: 'HeaderController'
    };
});
