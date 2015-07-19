'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.header').directive('rhaChatbutton', function () {
    return {
        scope: {},
        templateUrl: 'common/views/chatButton.html',
        restrict: 'A',
        controller: 'ChatButton',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});
