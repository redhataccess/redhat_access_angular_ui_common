'use strict';
angular.module('RedhatAccess.header').controller('TitleViewCtrl', [
    'COMMON_CONFIG',
    '$scope',
    'gettextCatalog',
    'CaseService',
    function (COMMON_CONFIG, $scope, gettextCatalog, CaseService) {
        $scope.COMMON_CONFIG = COMMON_CONFIG;
        $scope.showTitle = COMMON_CONFIG.show;
        $scope.titlePrefix = COMMON_CONFIG.titlePrefix;
        $scope.CaseService = CaseService;
        $scope.getPageTitle = function () {
            switch ($scope.page) {
            case 'search':
                return gettextCatalog.getString('Search');
            case 'caseList':
                return gettextCatalog.getString('SUPPORT CASES');
            case 'caseView':
                return gettextCatalog.getString('CASE {{caseNumber}}',{caseNumber:CaseService.kase.case_number});
            case 'newCase':
                return gettextCatalog.getString('OPEN A SUPPORT CASE');
            case 'logViewer':
                return gettextCatalog.getString('Logs');
            case 'searchCase':
                return gettextCatalog.getString('Search Support Case');
            case 'manageGroups':
                return gettextCatalog.getString('Manage Case Groups');
            case 'editGroup':
                return gettextCatalog.getString('Manage Default Case Groups');
            default:
                return '';
            }
        };
    }
]);
