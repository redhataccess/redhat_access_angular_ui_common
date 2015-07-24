'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.header').directive('rhaOnchange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('change', element.scope()[attrs.rhaOnchange]);
        }
    };
});