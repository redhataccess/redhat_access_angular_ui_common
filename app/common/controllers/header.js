'use strict';
angular.module('RedhatAccess.header').controller('HeaderController', [
    '$scope',
    'AlertService',
    'HeaderService',
    'CaseService',
    'COMMON_CONFIG',
    'RHAUtils',
    '$interval',
    '$sce',
    function ($scope, AlertService , HeaderService , CaseService , COMMON_CONFIG , RHAUtils, $interval , $sce) {
        /**
       * For some reason the rhaAlert directive's controller is not binding to the view.
       * Hijacking rhaAlert's parent controller (HeaderController) works
       * until a real solution is found.
       */
        $scope.AlertService = AlertService;
        $scope.HeaderService = HeaderService;
        $scope.CaseService = CaseService;
        $scope.closeable = true;
        $scope.closeAlert = function (index) {
            AlertService.alerts.splice(index, 1);
        };
        $scope.dismissAlerts = function () {
            AlertService.clearAlerts();
        };
        $scope.init = function () {
            HeaderService.pageLoadFailure = false;
            HeaderService.showPartnerEscalationError = false;
            CaseService.sfdcIsHealthy = COMMON_CONFIG.sfdcIsHealthy;
            HeaderService.sfdcIsHealthy = COMMON_CONFIG.sfdcIsHealthy;
            if (COMMON_CONFIG.doSfdcHealthCheck) {
                $scope.healthTimer = $interval(HeaderService.checkSfdcHealth, COMMON_CONFIG.healthCheckInterval);
            }
        };
        $scope.init();
        $scope.parseSfdcOutageHtml = function () {
            var parsedHtml = '';
            if (RHAUtils.isNotEmpty(COMMON_CONFIG.sfdcOutageMessage)) {
                var rawHtml = COMMON_CONFIG.sfdcOutageMessage;
                parsedHtml = $sce.trustAsHtml(rawHtml);
            }
            return parsedHtml;
        };
        $scope.$on('$destroy', function () {
            $interval.cancel($scope.healthTimer);
        });
        $scope.pageLoadFailureWatcher = $scope.$watch('HeaderService.pageLoadFailure', function() {
            if(HeaderService.pageLoadFailure) {
                $scope.dismissAlerts();
            }
        });
        $scope.$on('$locationChangeSuccess', function(event){
            $scope.dismissAlerts();
        });
    }
]);
