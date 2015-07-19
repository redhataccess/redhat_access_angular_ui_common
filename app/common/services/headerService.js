'use strict';
angular.module('RedhatAccess.header').factory('HeaderService', [
    'COMMON_CONFIG',
    'strataService',
    'CaseService',
    'securityService',
    'AlertService',
    '$q',
    function (COMMON_CONFIG , strataService , CaseService, securityService , AlertService , $q) {
        var service = {
            sfdcIsHealthy: COMMON_CONFIG.sfdcIsHealthy,
            checkSfdcHealth: function() {
                if (securityService.loginStatus.isLoggedIn) {
                    var deferred = $q.defer();
                    strataService.health.sfdc().then(angular.bind(this, function (response) {
                        if (response.name === 'SFDC' && response.status === true) {
                            service.sfdcIsHealthy = true;
                            CaseService.sfdcIsHealthy = true;
                        }
                        deferred.resolve(response);
                    }), angular.bind(this, function (error) {
                        if (error.xhr.status === 502) {
                            service.sfdcIsHealthy = false;
                            CaseService.sfdcIsHealthy = false;
                        }
                        AlertService.addStrataErrorMessage(error);
                        deferred.reject();
                    }));
                    return deferred.promise;
                }
            },
            pageLoading: false,
            pageLoadFailure: false,
            showSurvey: true,
            showPartnerEscalationError: false
        };
        return service;
    }
]);
