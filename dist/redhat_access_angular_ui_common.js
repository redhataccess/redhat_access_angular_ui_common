/*! redhat_access_angular_ui_common - v1.0.5 - 2015-08-05
 * Copyright (c) 2015 ;
 * Licensed 
 */
angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
/* jshint +W100 */
}]);
/*global angular */
'use strict';
/*global $ */
angular.module('RedhatAccess.common', [
	'RedhatAccess.ui-utils',
	'jmdobry.angular-cache',
	'RedhatAccessCommon.template'
]).config(["$angularCacheFactoryProvider", function($angularCacheFactoryProvider) {

}]).constant('RESOURCE_TYPES', {
	article: 'Article',
	solution: 'Solution'
}).value('COMMON_CONFIG', {
    'sfdcOutageMessage': '<ul class="message"><li class="alertSystem">Creating and updating support cases online is currently disabled. Please <a target="_blank" href="https://access.redhat.com/support/contact/technicalSupport/">contact Red Hat support</a> if you need immediate assistance.</li></ul>',
    'doSfdcHealthCheck' : false,
    'sfdcIsHealthy': true, // This property should be made false only when 'doSfdcHealthCheck' is set to false
    'healthCheckInterval': 60000,
    'showTitle': true,
    'titlePrefix': 'Red Hat Access: ',
    'isGS4': false
}).factory('configurationService', [
	'$q',
	function($q) {
		var defer = $q.defer();
		var service = {
			setConfig: function(config) {
				defer.resolve(config);
			},
			getConfig: function() {
				return defer.promise;
			}
		};
		return service;
	}
]);
'use strict';
/*global $ */
angular.module('RedhatAccess.header', [
	'RedhatAccessCommon.template'
	]);
'use strict';
/*jshint unused:vars */
var app = angular.module('RedhatAccess.ui-utils', ['gettext']);
//this is an example controller to provide tree data
// app.controller('TreeViewSelectorCtrl', ['$scope', 'TreeViewSelectorData',
//     function($scope, TreeViewSelectorData) {
//         $scope.name = 'Attachments';
//         $scope.attachmentTree = [];
//         TreeViewSelectorData.getTree('attachments').then(
//             function(tree) {
//                 $scope.attachmentTree = tree;
//             },
//             function() {
//             });
//     }
// ]);
app.service('RHAUtils',

    function () {
    /**
     * Generic function to decide if a simple object should be considered nothing
     */
      this.userTimeZone;
      this.isEmpty = function (object) {
        if (object === undefined || object === null || object === '' || object.length === 0 || object === {}) {
            return true;
        }
        return false;
      };
      this.isNotEmpty = function (object) {
        return !this.isEmpty(object);
      };
      this.isObjectEmpty =  function(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return true;
      };
      this.isEmailValid = function (object) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (object.match(mailformat)) {
            return true;
        } else {
            return false;
        }
      };

      this.convertToTimezone=function(date)
      {
        var timezoneDate=window.moment(date).tz(this.userTimeZone);
        return timezoneDate;
      };

      this.convertToMoment=function(date)
      {
            var momentDate=window.moment(date);
            return momentDate;
      };

       this.formatDate=function(date,formatter)
      {
        return date.format(formatter);
      };
      this.isWeeekend= function(){
          var currentDate = window.moment(); //get current date
          var timezoneDate = window.moment(currentDate).tz(this.userTimeZone); //change as per logged in user's timezone
          //Sunday as 0 and Saturday as 6.
          if(timezoneDate.day() == 0 || timezoneDate.day() == 6){
              return true;
          }else{
              return false;
          }

      }
});


//Wrapper service for translations
app.service('translate', [
    'gettextCatalog',
    function (gettextCatalog) {
        return function (str) {
            return gettextCatalog.getString(str);
        };
    }
]);
app.filter('trust_html', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
app.directive('rhaChoicetree', function () {
    return {
        template: '<ul><div rha-choice ng-repeat="choice in tree"></div></ul>',
        replace: true,
        transclude: true,
        restrict: 'A',
        scope: {
            tree: '=ngModel',
            rhaDisabled: '='
        }
    };
});
app.directive('optionsDisabled', ["$parse", function($parse) {
    var disableOptions = function(scope, attr, element, data, fnDisableIfTrue) {
        // refresh the disabled options in the select element.
        $('option[value!="?"]', element).each(function(i, e) {
            var locals = {};
            locals[attr] = data[i];
            $(this).attr('disabled', fnDisableIfTrue(scope, locals));
        });
    };
    return {
        priority: 0,
        link: function(scope, element, attrs, ctrl) {
            // parse expression and build array of disabled options
            var expElements = attrs.optionsDisabled.match(/^\s*(.+)\s+for\s+(.+)\s+in\s+(.+)?\s*/);
            var fnDisableIfTrue = $parse(expElements[1]);
            var options = expElements[3];
            scope.$watch(options, function(newValue, oldValue) {
                if(newValue) {
                    disableOptions(scope, expElements[2], element, newValue, fnDisableIfTrue);
                }
            }, true);
        }
    };
}]);
app.directive('rhaChoice', ["$compile", function ($compile) {
    return {
        restrict: 'A',
        templateUrl: 'common/views/treenode.html',
        link: function (scope, elm) {
            scope.choiceClicked = function (choice) {
                choice.checked = !choice.checked;
                function checkChildren(c) {
                    angular.forEach(c.children, function (c) {
                        c.checked = choice.checked;
                        checkChildren(c);
                    });
                }
                checkChildren(choice);
            };
            if (scope.choice.children.length > 0) {
                var childChoice = $compile('<div rha-choicetree ng-show="!choice.collapsed" ng-model="choice.children"></div>')(scope);
                elm.append(childChoice);
            }
        }
    };
}]);
app.factory('TreeViewSelectorData', [
    '$http',
    '$q',
    'TreeViewSelectorUtils',
    function ($http, $q, TreeViewSelectorUtils) {
        var service = {
                getTree: function (dataUrl, sessionId) {
                    var defer = $q.defer();
                    var tmpUrl = dataUrl;
                    if (sessionId) {
                        tmpUrl = tmpUrl + '?sessionId=' + encodeURIComponent(sessionId);
                    }
                    $http({
                        method: 'GET',
                        url: tmpUrl
                    }).success(function (data, status, headers, config) {
                        var tree = [];
                        TreeViewSelectorUtils.parseTreeList(tree, data);
                        defer.resolve(tree);
                    }).error(function (data, status, headers, config) {
                        defer.reject({});
                    });
                    return defer.promise;
                }
            };
        return service;
    }
]);
app.factory('TreeViewSelectorUtils', function () {
    var removeParams = function (path) {
        if (path) {
            var split = path.split('?');
            return split[0];
        }
        return path;
    };
    var isLeafChecked = function (path) {
        if (path) {
            var split = path.split('?');
            if (split[1]) {
                var params = split[1].split('&');
                for (var i = 0; i < params.length; i++) {
                    if (params[i].indexOf('checked=true') !== -1) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    var parseTreeNode = function (splitPath, tree, fullFilePath) {
        if (splitPath[0] !== undefined) {
            if (splitPath[0] !== '') {
                var node = splitPath[0];
                var match = false;
                var index = 0;
                for (var i = 0; i < tree.length; i++) {
                    if (tree[i].name === node) {
                        match = true;
                        index = i;
                        break;
                    }
                }
                if (!match) {
                    var nodeObj = {};
                    nodeObj.checked = isLeafChecked(node);
                    nodeObj.name = removeParams(node);
                    if (splitPath.length === 1) {
                        nodeObj.fullPath = removeParams(fullFilePath);
                    }
                    nodeObj.children = [];
                    tree.push(nodeObj);
                    index = tree.length - 1;
                }
                splitPath.shift();
                parseTreeNode(splitPath, tree[index].children, fullFilePath);
            } else {
                splitPath.shift();
                parseTreeNode(splitPath, tree, fullFilePath);
            }
        }
    };
    var hasSelectedLeaves = function (tree) {
        for (var i = 0; i < tree.length; i++) {
            if (tree[i] !== undefined) {
                if (tree[i].children.length === 0) {
                    //we only check leaf nodes
                    if (tree[i].checked === true) {
                        return true;
                    }
                } else {
                    if (hasSelectedLeaves(tree[i].children)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    var getSelectedNames = function (tree, container) {
        for (var i = 0; i < tree.length; i++) {
            if (tree[i] !== undefined) {
                if (tree[i].children.length === 0) {
                    if (tree[i].checked === true) {
                        container.push(tree[i].fullPath);
                    }
                } else {
                    getSelectedNames(tree[i].children, container);
                }
            }
        }
    };
    var service = {
            parseTreeList: function (tree, data) {
                var files = data.split('\n');
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var splitPath = file.split('/');
                    parseTreeNode(splitPath, tree, file);
                }
            },
            hasSelections: function (tree) {
                return hasSelectedLeaves(tree);
            },
            getSelectedLeaves: function (tree) {
                if (tree === undefined) {
                    return [];
                }
                var container = [];
                getSelectedNames(tree, container);
                return container;
            }
        };
    return service;
});
app.directive('rhaResizable', [
    '$window',
    '$timeout',
    function ($window) {
        var link = function (scope, element, attrs) {
            scope.onResizeFunction = function () {
                var distanceToTop = element[0].getBoundingClientRect().top;
                var height = $window.innerHeight - distanceToTop;
                element.css('height', height);
            };
            angular.element($window).bind('resize', function () {
                scope.onResizeFunction();    //scope.$apply();
            });
            angular.element($window).bind('click', function () {
                scope.onResizeFunction();    //scope.$apply();
            });
            if (attrs.rhaDomReady !== undefined) {
                scope.$watch('rhaDomReady', function (newValue) {
                    if (newValue) {
                        scope.onResizeFunction();
                    }
                });
            } else {
                scope.onResizeFunction();
            }
        };
        return {
            restrict: 'A',
            scope: { rhaDomReady: '=' },
            link: link
        };
    }
]);

'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.security', [
    'ui.bootstrap',
    'RedhatAccessCommon.template',
    'ui.router',
    'RedhatAccess.common',
    'RedhatAccess.header'
]).constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',
    sessionIdChanged: 'sid-changed'
}).value('LOGIN_VIEW_CONFIG', { verbose: true }).value('SECURITY_CONFIG', {
    displayLoginStatus: true,
    autoCheckLogin: true,
    loginURL: '',
    logoutURL: '',
    forceLogin: false
});
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

'use strict';
angular.module('RedhatAccess.header').controller('404', [
    '$scope',
    'securityService',
    'COMMON_CONFIG',
    function ($scope, securityService, COMMON_CONFIG) {
		$scope.COMMON_CONFIG = COMMON_CONFIG;
        $scope.securityService = securityService;
    }
]);

'use strict';
angular.module('RedhatAccess.header').controller('AlertController', [
    '$scope',
    'AlertService',
    'HeaderService',
    'securityService',
    function ($scope, AlertService, HeaderService, securityService) {
        $scope.AlertService = AlertService;
        $scope.HeaderService = HeaderService;
        $scope.securityService = securityService;
        $scope.closeable = true;
        $scope.closeAlert = function (index) {
            AlertService.alerts.splice(index, 1);
        };
        $scope.dismissAlerts = function () {
            AlertService.clearAlerts();
        };
    }
]);

'use strict';
/*jshint camelcase: false, expr: true*/
//Saleforce hack---
//we have to monitor stuff on the window object
//because the liveagent code generated by Salesforce is not
//designed for angularjs.
//We create fake buttons that we give to the salesforce api so we can track
//chat availability without having to write a complete rest client.
window.fakeOnlineButton = { style: { display: 'none' } };
window.fakeOfflineButton = { style: { display: 'none' } };
//
angular.module('RedhatAccess.header').controller('ChatButton', [
    '$scope',
    'CaseService',
    'securityService',
    'strataService',
    'AlertService',
    'CHAT_SUPPORT',
    'AUTH_EVENTS',
    '$rootScope',
    '$sce',
    '$http',
    '$interval',
    function ($scope, CaseService, securityService, strataService, AlertService, CHAT_SUPPORT, AUTH_EVENTS, $rootScope, $sce, $http, $interval) {
        $scope.securityService = securityService;
        if (window.chatInitialized === undefined) {
            window.chatInitialized = false;
        }
        $scope.checkChatButtonStates = function () {
            $scope.chatAvailable = window.fakeOnlineButton.style.display !== 'none';
        };
        $scope.timer = null;
        $scope.chatHackUrl = $sce.trustAsResourceUrl(CHAT_SUPPORT.chatIframeHackUrlPrefix);
        $scope.setChatIframeHackUrl = function () {
            strataService.users.chatSession.post().then(angular.bind(this, function (sessionId) {
                var url = CHAT_SUPPORT.chatIframeHackUrlPrefix + '?sessionId=' + sessionId + '&ssoName=' + securityService.loginStatus.authedUser.sso_username;
                $scope.chatHackUrl = $sce.trustAsResourceUrl(url);
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
        $scope.enableChat = function () {
            $scope.showChat = securityService.loginStatus.isLoggedIn && securityService.loginStatus.authedUser.has_chat && CHAT_SUPPORT.enableChat;
            return $scope.showChat;
        };
        $scope.showChat = false;
        // determines whether we should show buttons at all
        $scope.chatAvailable = false;
        //Availability of chat as determined by live agent, toggles chat buttons
        $scope.initializeChat = function () {
            if (!$scope.enableChat() || window.chatInitialized === true) {
                //function should only be called when chat is enabled, and only once per page load
                return;
            }
            if (!window._laq) {
                window._laq = [];
            }
            window._laq.push(function () {
                liveagent.showWhenOnline(CHAT_SUPPORT.chatButtonToken, window.fakeOnlineButton);
                liveagent.showWhenOffline(CHAT_SUPPORT.chatButtonToken, window.fakeOfflineButton);
            });
            //var chatToken = securityService.loginStatus.sessionId;
            var ssoName = securityService.loginStatus.authedUser.sso_username;
            var name = securityService.loginStatus.authedUser.loggedInUser;
            //var currentCaseNumber;
            var accountNumber = securityService.loginStatus.authedUser.account_number;
            // if (currentCaseNumber) {
            //   liveagent
            //     .addCustomDetail('Case Number', currentCaseNumber)
            //     .map('Case', 'CaseNumber', false, false, false)
            //     .saveToTranscript('CaseNumber__c');
            // }
            // if (chatToken) {
            //   liveagent
            //     .addCustomDetail('Session ID', chatToken)
            //     .map('Contact', 'SessionId__c', false, false, false);
            // }
            liveagent.addCustomDetail('Contact Login', ssoName).map('Contact', 'SSO_Username__c', true, true, true).saveToTranscript('SSO_Username__c');
            //liveagent
            //  .addCustomDetail('Contact E-mail', email)
            //  .map('Contact', 'Email', false, false, false);
            liveagent.addCustomDetail('Account Number', accountNumber).map('Account', 'AccountNumber', true, true, true);
            liveagent.setName(name);
            liveagent.addCustomDetail('Name', name);
            liveagent.setChatWindowHeight('552');
            //liveagent.enableLogging();
            liveagent.init(CHAT_SUPPORT.chatLiveAgentUrlPrefix, CHAT_SUPPORT.chatInitHashOne, CHAT_SUPPORT.chatInitHashTwo);
            window.chatInitialized = true;
        };
        $scope.openChatWindow = function () {
            liveagent.startChat(CHAT_SUPPORT.chatButtonToken);
        };
        $scope.init = function () {
            if ($scope.enableChat() && window.liveagent !== undefined){
                $scope.setChatIframeHackUrl();
                $scope.timer = $interval($scope.checkChatButtonStates, 5000);
                $scope.initializeChat();
            }
        };
        $scope.$on('$destroy', function () {
            //we cancel timer each time scope is destroyed
            //it will be restarted via init on state change to a page that has a chat buttom
            $interval.cancel($scope.timer);
        });
        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();
        } else {
            $scope.$on(AUTH_EVENTS.loginSuccess, function () {
                $scope.init();
            });
        }

        $scope.$on('$destroy', function () {
            window._laq = null;
        });
    }
]);

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

'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.header').directive('rha403error', function () {
    return {
        templateUrl: 'common/views/403.html',
        restrict: 'A',
        controller: '403'
    };
});

'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.header').directive('rha404error', function () {
    return {
        templateUrl: 'common/views/404.html',
        restrict: 'A',
        controller: '404'
    };
});

'use strict';
angular.module('RedhatAccess.header').directive('rhaAlert', function () {
    return {
        templateUrl: 'common/views/alert.html',
        restrict: 'A',
        controller: 'AlertController'
    };
});

'use strict';
app.directive('autoFocus', ["$timeout", function($timeout) {
    return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(function(){
                _element[0].focus();
            }, 100);
        }
    };
}]);

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

'use strict';
angular.module('RedhatAccess.header').directive('rhaHeader', function () {
    return {
		templateUrl: 'common/views/header.html',
        restrict: 'A',
        scope: { page: '@' },
        controller: 'HeaderController'
    };
});

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
'use strict';
angular.module('RedhatAccess.header').directive('rhaTitletemplate', function () {
    return {
        restrict: 'AE',
        scope: { page: '@' },
        templateUrl: 'common/views/title.html',
        controller: 'TitleViewCtrl'
    };
});

'use strict';
angular.module('RedhatAccess.header').service('AlertService', [
    '$filter',
    'AUTH_EVENTS',
    '$rootScope',
    'RHAUtils',
    'gettextCatalog',
    function ($filter, AUTH_EVENTS, $rootScope, RHAUtils, gettextCatalog) {
        var ALERT_TYPES = {
                DANGER: 'danger',
                SUCCESS: 'success',
                WARNING: 'warning',
                INFO: 'info'
            };
        this.alerts = [];
        //array of {message: 'some alert', type: '<type>'} objects
        this.clearAlerts = function () {
            this.alerts = [];
        };
        this.addAlert = function (alert) {
            this.alerts.push(alert);
        };
        this.removeAlert = function (alert) {
            this.alerts.splice(this.alerts.indexOf(alert), 1);
        };
        this.addDangerMessage = function (message) {
            return this.addMessage(message, ALERT_TYPES.DANGER);
        };
        this.addSuccessMessage = function (message) {
            return this.addMessage(message, ALERT_TYPES.SUCCESS);
        };
        this.addWarningMessage = function (message) {
            return this.addMessage(message, ALERT_TYPES.WARNING);
        };
        this.addInfoMessage = function (message) {
            return this.addMessage(message, ALERT_TYPES.INFO);
        };
        this.addMessage = function (message, type) {
            var alert = {
                    message: message,
                    type: type === null ? 'warning' : type
                };
            this.addAlert(alert);
            $('body,html').animate({ scrollTop: $('body').offset().top }, 100);
            //Angular adds a unique hash to each alert during data binding,
            //so the returned alert will be unique even if the
            //message and type are identical.
            return alert;
        };
        this.getErrors = function () {
            var errors = $filter('filter')(this.alerts, { type: ALERT_TYPES.DANGER });
            if (errors === null) {
                errors = [];
            }
            return errors;
        };
        this.addStrataErrorMessage = function (error) {
            if (RHAUtils.isNotEmpty(error)) {
                var errorText=error.message;
                if (error.xhr && error.xhr.responseText){
                    errorText = errorText.concat(' Message: ' + error.xhr.responseText);
                }
                var existingMessage = $filter('filter')(this.alerts, {
                        type: ALERT_TYPES.DANGER,
                        message: errorText
                    });
                if (existingMessage.length < 1) {
                    this.addDangerMessage(errorText);
                }
            }
        };
        this.addUDSErrorMessage = function (error) {
            if (RHAUtils.isNotEmpty(error)) {
                this.addDangerMessage(error);
            }
        };
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, angular.bind(this, function () {
            this.clearAlerts();
            this.addMessage(gettextCatalog.getString('You have successfully logged out of the Red Hat Customer Portal.'));
        }));
        $rootScope.$on(AUTH_EVENTS.loginSuccess, angular.bind(this, function () {
            this.clearAlerts();
        }));
    }
]);

'use strict';
angular.module('RedhatAccess.common').service('ConstantsService', [
    'securityService',
    'gettextCatalog',
    'STATUS',
    function (securityService, gettextCatalog, STATUS) {
        this.sortByParams = [
            {
                ///this refers  in context of "sorting on Newest Date Modified"
                name: gettextCatalog.getString('Newest Date Modified'),
                sortField: 'lastModifiedDate',
                sortOrder: 'DESC'
            },
            {
                ///this refers  in context of "sorting on Oldest Date Modified"
                name: gettextCatalog.getString('Oldest Date Modified'),
                sortField: 'lastModifiedDate',
                sortOrder: 'ASC'
            },
            {
                ///this refers  in context of "sorting on Highest Severity"
                name: gettextCatalog.getString('Highest Severity'),
                sortField: 'severity',
                sortOrder: 'ASC'
            },
            {
                ///this refers  in context of "sorting on Lowest Severity"
                name: gettextCatalog.getString('Lowest Severity'),
                sortField: 'severity',
                sortOrder: 'DESC'
            },
            {
                ///this refers  in context of "sorting on Newest Date Created"
                name: gettextCatalog.getString('Newest Date Created'),
                sortField: 'createdDate',
                sortOrder: 'DESC'
            },
            {
                ///this refers  in context of "sorting on Oldest Date Created"
                name: gettextCatalog.getString('Oldest Date Created'),
                sortField: 'createdDate',
                sortOrder: 'ASC'
            },
            {
                ///this refers  in context of "sorting on Case Owner (A-Z)"
                name: gettextCatalog.getString('Case Owner (A-Z)'),
                sortField: 'owner',
                sortOrder: 'ASC'
            },
            {
                ///this refers  in context of "sorting on Case Owner (Z-A)"
                name: gettextCatalog.getString('Case Owner (Z-A)'),
                sortField: 'owner',
                sortOrder: 'DESC'
            },
            {
                ///this refers  in context of "sorting on Case Status (A-Z)"
                name: gettextCatalog.getString('Case Status (A-Z)'),
                sortField: 'status',
                sortOrder: 'ASC'
            },
            {
                ///this refers  in context of "sorting on Case Status (Z-A)"
                name: gettextCatalog.getString('Case status (Z-A)'),
                sortField: 'status',
                sortOrder: 'DESC'
            }
        ];
        this.statuses = [
            {
                ///Open and closed refers to Open and Closed support cases
                name: gettextCatalog.getString('Open and Closed'),
                value: STATUS.both
            },
            {
                ///Open refers to Open support cases
                name: gettextCatalog.getString('Open'),
                value: STATUS.open
            },
            {
                ///Closed refers to Closed support cases
                name: gettextCatalog.getString('Closed'),
                value: STATUS.closed
            }
        ];
    }
]);

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

'use strict';
/*global navigator, strata, angular*/
/*jshint camelcase: false */
/*jshint bitwise: false */
/*jshint unused:vars */
angular.module('RedhatAccess.common').factory('strataService', [
    '$q',
    'gettextCatalog',
    'RHAUtils',
    '$angularCacheFactory',
    'RESOURCE_TYPES',
    function ($q, gettextCatalog, RHAUtils, $angularCacheFactory, RESOURCE_TYPES) {
        $angularCacheFactory('strataCache', {
            capacity: 1000,
            maxAge: 900000,
            deleteOnExpire: 'aggressive',
            recycleFreq: 60000,
            cacheFlushInterval: 3600000,
            storageMode: 'sessionStorage',
            verifyIntegrity: true
        });
        var ie8 = false;
        if (navigator.appVersion.indexOf('MSIE 8.') !== -1) {
            ie8 = true;
        }
        var strataCache;
        if (!ie8) {
            strataCache = $angularCacheFactory.get('strataCache');
            $(window).unload(function () {
                strataCache.destroy();
            });
        }
        var errorHandler = function (message, xhr, response, status) {
            var translatedMsg = message;
            switch (status) {
            case 'Unauthorized':
                translatedMsg = gettextCatalog.getString('Unauthorized.');
                break; // case n:
                //   code block
                //   break;
            }
            this.reject({
                message: translatedMsg,
                xhr: xhr,
                response: response,
                status: status
            });
        };
        var clearCache = function (key) {
            if (!ie8) {
                strataCache.remove(key);
            }
        };
        var service = {
            authentication: {
                checkLogin: function () {
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('auth')) {
                        strata.addAccountNumber(strataCache.get('auth').account_number);
                        deferred.resolve(strataCache.get('auth'));
                    } else {
                        strata.checkLogin(function (result, authedUser) {
                            if (result) {
                                service.accounts.list().then(function (accountNumber) {
                                    service.accounts.get(accountNumber).then(function (account) {
                                        authedUser.account = account;
                                        strata.addAccountNumber(account.number);
                                        if (!ie8) {
                                            strataCache.put('auth', authedUser);
                                        }
                                        deferred.resolve(authedUser);
                                    });
                                }, function (error) {
                                    //TODO revisit this behavior
                                    authedUser.account = undefined;
                                    deferred.resolve(authedUser);
                                });
                            } else {
                                var error = {message: 'Unauthorized.'};
                                deferred.reject(error);
                            }
                        });
                    }
                    return deferred.promise;
                },
                setCredentials: function (username, password) {
                    return strata.setCredentials(username, password);
                },
                logout: function () {
                    if (!ie8) {
                        strataCache.removeAll();
                    }
                    strata.clearCredentials();
                }
            },
            cache: {
                clr: function(key) {
                    clearCache(key);
                }
            },
            entitlements: {
                get: function (showAll, ssoUserName) {
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('entitlements' + ssoUserName)) {
                        deferred.resolve(strataCache.get('entitlements' + ssoUserName));
                    } else {
                        strata.entitlements.get(showAll, function (entitlements) {
                            if (!ie8) {
                                strataCache.put('entitlements' + ssoUserName, entitlements);
                            }
                            deferred.resolve(entitlements);
                        }, angular.bind(deferred, errorHandler), ssoUserName);
                    }
                    return deferred.promise;
                }
            },
            problems: function (data, max) {
                var deferred = $q.defer();
                strata.problems(data, function (solutions) {
                    deferred.resolve(solutions);
                }, angular.bind(deferred, errorHandler), max);
                return deferred.promise;
            },
            recommendations: function (data, max, highlight, highlightTags) {
                var deferred = $q.defer();
                strata.recommendations(data, function (recommendations) {
                    deferred.resolve(recommendations);
                }, angular.bind(deferred, errorHandler), max, highlight, highlightTags);
                return deferred.promise;
            },
            recommendationsXmlHack: function (data, max, highlight, highlightTags) {
                var deferred = $q.defer();
                strata.recommendationsXmlHack(data, function (recommendations) {
                    deferred.resolve(recommendations);
                }, angular.bind(deferred, errorHandler), max, highlight, highlightTags);
                return deferred.promise;
            },
            solutions: {
                get: function (uri) {
                    var deferred = $q.defer();
                    var splitUri = uri.split('/');
                    uri = splitUri[splitUri.length - 1];
                    if (!ie8 && strataCache.get('solution' + uri)) {
                        deferred.resolve(strataCache.get('solution' + uri));
                    } else {
                        strata.solutions.get(uri, function (solution) {
                            solution.resource_type = RESOURCE_TYPES.solution; //Needed upstream
                            if (!ie8) {
                                strataCache.put('solution' + uri, solution);
                            }
                            deferred.resolve(solution);
                        }, function () {
                            //workaround for 502 from strata
                            //If the deferred is rejected then the parent $q.all()
                            //based deferred will fail. Since we don't need every
                            //recommendation just send back undefined
                            //and the caller can ignore the missing solution details.
                            deferred.resolve();
                        });
                    }
                    return deferred.promise;
                }, 
                search: function(searchString, max){
                    var deferred = $q.defer();
                    strata.search(
                        searchString,
                        function (entries) {
                            if (entries !== undefined) {
                                deferred.resolve(entries);
                            }
                            
                        },
                        angular.bind(deferred, errorHandler),
                        max,
                        false);
                    return deferred.promise;

                }
            },
            search: function (searchString, max) {
                var resultsDeferred = $q.defer();
                var deferreds = [];
                strata.search(
                    searchString,
                    function (entries) {
                        //retrieve details for each solution
                        if (entries !== undefined) {
                            entries.forEach(function (entry) {
                                var deferred = $q.defer();
                                deferreds.push(deferred.promise);
                                var cacheMiss = true;
                                if (entry.resource_type === RESOURCE_TYPES.solution) {
                                    if (!ie8 && strataCache.get('solution' + entry.uri)) {
                                        deferred.resolve(strataCache.get('solution' + entry.uri));
                                        cacheMiss = false;
                                    }

                                }
                                // else if (entry.resource_type === RESOURCE_TYPES.article) {
                                //     if (strataCache.get('article' + entry.uri)) {
                                //         deferred.resolve(strataCache.get('article' + entry.uri));
                                //         cacheMiss = false;
                                //     }
                                // }
                                if (cacheMiss) {
                                    strata.utils.getURI(entry.uri, entry.resource_type, function (type, info) {
                                        if (info !== undefined) {
                                            info.resource_type = type;
                                            if (!ie8 && (type === RESOURCE_TYPES.solution)) {
                                                strataCache.put('solution' + entry.uri, info);
                                            }
                                        }
                                        deferred.resolve(info);
                                    }, function (error) {
                                        deferred.resolve();
                                    });
                                }
                            });
                        }
                        $q.all(deferreds).then(
                            function (results) {
                                resultsDeferred.resolve(results);
                            },
                            angular.bind(resultsDeferred, errorHandler));
                    },
                    angular.bind(resultsDeferred, errorHandler),
                    max,
                    false);
                return resultsDeferred.promise;
            },
            products: {
                list: function (ssoUserName) {
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('products' + ssoUserName)) {
                        deferred.resolve(strataCache.get('products' + ssoUserName));
                    } else {
                        strata.products.list(function (response) {
                            if (!ie8) {
                                strataCache.put('products' + ssoUserName, response);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler), ssoUserName);
                    }
                    return deferred.promise;
                },
                versions: function (productCode) {
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('versions-' + productCode)) {
                        var responseCopy = [];
                        angular.copy(strataCache.get('versions-' + productCode), responseCopy);
                        deferred.resolve(responseCopy);
                    } else {
                        strata.products.versions(productCode, function (response) {
                            if (!ie8) {
                                strataCache.put('versions-' + productCode, response);
                            }
                            var responseCopy = [];
                            angular.copy(response, responseCopy);
                            deferred.resolve(responseCopy);
                        }, angular.bind(deferred, errorHandler));
                    }
                    return deferred.promise;
                },
                get: function (productCode) {
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('product' + productCode)) {
                        deferred.resolve(strataCache.get('product' + productCode));
                    } else {
                        strata.products.get(productCode, function (response) {
                            if (!ie8) {
                                strataCache.put('product' + productCode, response);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                    }
                    return deferred.promise;
                }
            },
            groups: {
                get: function (groupNum, ssoUserName) {
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('groups' + groupNum + ssoUserName)) {
                        deferred.resolve(strataCache.get('groups' + groupNum + ssoUserName));
                    } else {
                        strata.groups.get(groupNum, function (response) {
                            if (!ie8) {
                                strataCache.put('groups' + groupNum + ssoUserName, response);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler), ssoUserName);
                    }
                    return deferred.promise;
                },
                list: function (ssoUserName, flushCashe) {
                    var deferred = $q.defer();
                    if(flushCashe){
                        strataCache.remove('groups' + ssoUserName);
                    }
                    if (!ie8 && strataCache.get('groups' + ssoUserName)) {
                        deferred.resolve(strataCache.get('groups' + ssoUserName));
                    } else {
                        strata.groups.list(function (response) {
                            if (!ie8) {
                                strataCache.put('groups' + ssoUserName, response);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler), ssoUserName);
                    }
                    return deferred.promise;
                },
                remove: function (groupNum, ssoUserName) {
                    var deferred = $q.defer();
                    strata.groups.remove(groupNum, function (response) {
                        deferred.resolve(response);
                        clearCache('groups' + ssoUserName);
                    }, angular.bind(deferred, errorHandler));
                    return deferred.promise;
                },
                create: function (groupName, ssoUserName) {
                    var deferred = $q.defer();
                    strata.groups.create(groupName, function (response) {
                        deferred.resolve(response);
                        clearCache('groups' + ssoUserName);
                    }, angular.bind(deferred, errorHandler));
                    return deferred.promise;
                },
                update: function(group, ssoUserName){
                    var deferred = $q.defer();
                    strata.groups.update(group, function (response) {
                        deferred.resolve(response);
                        clearCache('groups' + ssoUserName);
                        clearCache('groups' + group.number + ssoUserName);
                    }, angular.bind(deferred, errorHandler));
                    return deferred.promise;
                },
                createDefault: function(group){
                    var deferred = $q.defer();
                    strata.groups.createDefault(group, function (response) {
                        deferred.resolve(response);
                    }, angular.bind(deferred, errorHandler));
                    return deferred.promise;
                }
            },
            groupUsers: {
                update: function(users, accountId, groupnum){
                    var deferred = $q.defer();
                    strata.groupUsers.update(users, accountId, groupnum, function (response) {
                        deferred.resolve(response);
                        if (!ie8 && strataCache.get('users' + accountId + groupnum)) {
                            clearCache('users' + accountId + groupnum);
                        }
                    }, angular.bind(deferred, errorHandler));
                    return deferred.promise;
                }
            },
            accounts: {
                get: function (accountNumber) {
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('account' + accountNumber)) {
                        deferred.resolve(strataCache.get('account' + accountNumber));
                    } else {
                        strata.accounts.get(accountNumber, function (response) {
                            if (!ie8) {
                                strataCache.put('account' + accountNumber, response);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                    }
                    return deferred.promise;
                },
                users: function (accountNumber, group) {
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('users' + accountNumber + group)) {
                        deferred.resolve(strataCache.get('users' + accountNumber + group));
                    } else {
                        strata.accounts.users(accountNumber, function (response) {
                            if (!ie8) {
                                strataCache.put('users' + accountNumber + group, response);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler), group);
                    }
                    return deferred.promise;
                },
                list: function () {
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('account')) {
                        deferred.resolve(strataCache.get('account'));
                    } else {
                        strata.accounts.list(function (response) {
                            if (!ie8) {
                                strataCache.put('account', response);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                    }
                    return deferred.promise;
                }
            },
            cases: {
                csv: function () {
                    var deferred = $q.defer();
                    strata.cases.csv(function (response) {
                        deferred.resolve(response);
                    }, angular.bind(deferred, errorHandler));
                    return deferred.promise;
                },
                attachments: {
                    list: function (id) {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('attachments' + id)) {
                            deferred.resolve(strataCache.get('attachments' + id));
                        } else {
                            strata.cases.attachments.list(id, function (response) {
                                angular.forEach(response , angular.bind(this, function (element) {
                                    var modifiedDate=element.created_date;
                                    var lastModifiedDate=RHAUtils.convertToTimezone(element.last_modified_date);
                                    element.sortModifiedDate=modifiedDate;
                                    element.last_modified_date=RHAUtils.formatDate(lastModifiedDate,'MMM DD YYYY');
                                    element.last_modified_time=RHAUtils.formatDate(lastModifiedDate,'hh:mm A Z');
                                    var createdDate=RHAUtils.convertToTimezone(element.created_date);
                                    element.created_date=RHAUtils.formatDate(createdDate,'MMM DD YYYY');
                                    element.created_time=RHAUtils.formatDate(createdDate,'hh:mm A Z');

                                }));
                                if (!ie8) {
                                    strataCache.put('attachments' + id, response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                        }
                        return deferred.promise;
                    },
                    post: function (attachment, caseNumber) {
                        var deferred = $q.defer();
                        strata.cases.attachments.post(attachment, caseNumber, function (response, code, xhr) {
                            if (!ie8) {
                                strataCache.remove('attachments' + caseNumber);
                            }
                            deferred.resolve(xhr.getResponseHeader('Location'));
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    },
                    remove: function (id, caseNumber) {
                        var deferred = $q.defer();
                        strata.cases.attachments.remove(id, caseNumber, function (response) {
                            if (!ie8) {
                                strataCache.remove('attachments' + caseNumber);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    }
                },
                comments: {
                    get: function (id) {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('comments' + id)) {
                            deferred.resolve(strataCache.get('comments' + id));
                        } else {
                            strata.cases.comments.get(id, function (response) {
                                angular.forEach(response, angular.bind(this, function (comment) {
                                    var lastModifiedDate = RHAUtils.convertToTimezone(comment.last_modified_date);
                                    var modifiedDate=comment.created_date;
                                    comment.sortModifiedDate=modifiedDate;
                                    comment.last_modified_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                                    comment.last_modified_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                                    var createdDate = RHAUtils.convertToTimezone(comment.created_date);
                                    comment.created_date = RHAUtils.formatDate(createdDate, 'MMM DD YYYY');
                                    comment.created_time = RHAUtils.formatDate(createdDate, 'hh:mm A Z');
                                }));
                                if (!ie8) {
                                    strataCache.put('comments' + id, response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                        }
                        return deferred.promise;
                    },
                    post: function (caseNumber, text, isPublic, isDraft) {
                        var deferred = $q.defer();
                        strata.cases.comments.post(caseNumber, {
                            'text': text,
                            'draft': isDraft === true ? 'true' : 'false',
                            'public': isPublic === true ? 'true' : 'false'
                        }, function (response) {
                            if (!ie8) {
                                strataCache.remove('comments' + caseNumber);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    },
                    put: function (caseNumber, text, isDraft, isPublic, comment_id) {
                        var deferred = $q.defer();
                        strata.cases.comments.update(caseNumber, {
                            'text': text,
                            'draft': isDraft === true ? 'true' : 'false',
                            'public': isPublic === true ? 'true' : 'false',
                            'caseNumber': caseNumber,
                            'id': comment_id
                        }, comment_id, function (response) {
                            if (!ie8) {
                                strataCache.remove('comments' + caseNumber);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    }
                },
                notified_users: {
                    add: function (caseNumber, ssoUserName) {
                        var deferred = $q.defer();
                        strata.cases.notified_users.add(caseNumber, ssoUserName, function (response) {
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    },
                    remove: function (caseNumber, ssoUserName) {
                        var deferred = $q.defer();
                        strata.cases.notified_users.remove(caseNumber, ssoUserName, function (response) {
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    }
                },
                get: function (id) {
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('case' + id)) {
                        deferred.resolve([
                            strataCache.get('case' + id),
                            true
                        ]);
                    } else {
                        strata.cases.get(id, function (response) {
                            var kase=response;
                            var tzDate=RHAUtils.convertToTimezone(response.created_date);
                            response.created_date=RHAUtils.formatDate(tzDate,'MMM DD YYYY hh:mm:ss A Z');
                            angular.forEach(response.chats.chat, angular.bind(this, function (chat) {
                                chat.sortModifiedDate=chat.start_time;
                                var lastModifiedDate=RHAUtils.convertToTimezone(chat.start_time);
                                chat.start_date=RHAUtils.formatDate(lastModifiedDate,'MMM DD YYYY');
                                chat.start_time=RHAUtils.formatDate(lastModifiedDate,'hh:mm:ss A Z');
                            }));
                            if (!ie8) {
                                strataCache.put('case' + id, response);
                            }
                            deferred.resolve([
                                response,
                                false
                            ]);
                        }, angular.bind(deferred, errorHandler));
                    }
                    return deferred.promise;
                },
                search: function (caseStatus, caseOwner, caseGroup, searchString, sortField, sortOrder, offset, limit, queryParams, addlQueryParams) {
                    var deferred = $q.defer();
                    strata.cases.search(function (response) {
                        angular.forEach(response['case'], angular.bind(this, function (kase) {
                           var createdDate=RHAUtils.convertToTimezone(kase.created_date);
                           kase.created_date=RHAUtils.formatDate(createdDate,'MMM DD YYYY');
                           var modifiedDate=RHAUtils.convertToTimezone(kase.last_modified_date);
                           kase.last_modified_date=RHAUtils.formatDate(modifiedDate,'MMM DD YYYY');
                        }));
                        deferred.resolve(response);
                    }, angular.bind(deferred, errorHandler), caseStatus, caseOwner, caseGroup, searchString, sortField, sortOrder, offset, limit, queryParams, addlQueryParams);
                    return deferred.promise;
                },
                filter: function (params) {
                    var deferred = $q.defer();
                    if (RHAUtils.isEmpty(params)) {
                        params = {};
                    }
                    if (RHAUtils.isEmpty(params.count)) {
                        params.count = 50;
                    }
                    if (!ie8 && strataCache.get('filter' + JSON.stringify(params))) {
                        deferred.resolve(strataCache.get('filter' + JSON.stringify(params)));
                    } else {
                        strata.cases.filter(params, function (response) {
                            angular.forEach(response['case'], angular.bind(this, function (kase) {
                                var createdDate=RHAUtils.convertToTimezone(kase.created_date);
                                kase.created_date=RHAUtils.formatDate(createdDate,'MMM DD YYYY');
                                var modifiedDate=RHAUtils.convertToTimezone(kase.last_modified_date);
                                kase.last_modified_date=RHAUtils.formatDate(modifiedDate,'MMM DD YYYY');
                            }));
                            if (!ie8) {
                                strataCache.put('filter' + JSON.stringify(params), response);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                    }
                    return deferred.promise;
                },
                post: function (caseJSON) {
                    var deferred = $q.defer();
                    strata.cases.post(caseJSON, function (caseNumber) {
                        //Remove any case filters that are cached
                        if (!ie8) {
                            for (var k in strataCache.keySet()) {
                                if (~k.indexOf('filter')) {
                                    strataCache.remove(k);
                                }
                            }
                        }
                        deferred.resolve(caseNumber);
                    }, angular.bind(deferred, errorHandler));
                    return deferred.promise;
                },
                put: function (caseNumber, caseJSON) {
                    var deferred = $q.defer();
                    strata.cases.put(caseNumber, caseJSON, function (response) {
                        if (!ie8) {
                            strataCache.remove('case' + caseNumber);
                            for (var k in strataCache.keySet()) {
                                if (~k.indexOf('filter')) {
                                    strataCache.remove(k);
                                }
                            }
                        }
                        deferred.resolve(response);
                    }, angular.bind(deferred, errorHandler));
                    return deferred.promise;
                },
                owner: {
                    update: function (caseNumber, ssoUserName) {
                        var deferred = $q.defer();
                        strata.cases.owner.update(caseNumber, ssoUserName, function (response) {
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    }
                }
            },
            values: {
                cases: {
                    severity: function () {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('severities')) {
                            deferred.resolve(strataCache.get('severities'));
                        } else {
                            strata.values.cases.severity(function (response) {
                                if (!ie8) {
                                    strataCache.put('severities', response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                        }
                        return deferred.promise;
                    },
                    status: function () {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('statuses')) {
                            deferred.resolve(strataCache.get('statuses'));
                        } else {
                            strata.values.cases.status(function (response) {
                                if (!ie8) {
                                    strataCache.put('statuses', response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                        }
                        return deferred.promise;
                    },
                    types: function () {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('types')) {
                            deferred.resolve(strataCache.get('types'));
                        } else {
                            strata.values.cases.types(function (response) {
                                if (!ie8) {
                                    strataCache.put('types', response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                        }
                        return deferred.promise;
                    },
                    attachment: {
                        size: function () {
                            var deferred = $q.defer();
                            if (!ie8 && strataCache.get('attachmentMaxSize')) {
                                deferred.resolve(strataCache.get('attachmentMaxSize'));
                            } else {
                                strata.values.cases.attachment.size(function (response) {
                                    if (!ie8) {
                                        strataCache.put('attachmentMaxSize', response);
                                    }
                                    deferred.resolve(response);
                                }, angular.bind(deferred, errorHandler));
                            }
                            return deferred.promise;
                        }
                    }
                },
                businesshours: function(timezone){
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('businesshours')) {
                        deferred.resolve(strataCache.get('businesshours'));
                    } else {
                        strata.values.businesshours(timezone,function (response) {
                            if (!ie8) {
                                strataCache.put('businesshours', response);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                    }
                    return deferred.promise;
                }
            },
            users: {
                get: function (userId) {
                    var deferred = $q.defer();
                    if (!ie8 && strataCache.get('userId' + userId)) {
                        deferred.resolve(strataCache.get('userId' + userId));
                    } else {
                        strata.users.get(function (response) {
                            if (!ie8) {
                                strataCache.put('userId' + userId, response);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler), userId);
                    }
                    return deferred.promise;
                },
                chatSession: {
                    post: function(){
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('chatSession')) {
                            deferred.resolve(strataCache.get('chatSession'));
                        } else {
                            strata.users.chatSession.get(function (response) {
                                if (!ie8) {
                                    strataCache.put('chatSession', response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                        }
                        return deferred.promise;
                    }
                }
            },
            health: {
                sfdc: function () {
                    var deferred = $q.defer();
                    strata.health.sfdc(function (response) {
                        deferred.resolve(response);
                    }, angular.bind(deferred, errorHandler));
                    return deferred.promise;
                }
            },
            escalationRequest: {
                create: function (escalationJSON) {
                    var deferred = $q.defer();
                    strata.escalation.create(escalationJSON, function (escalationNum) {
                        deferred.resolve(escalationNum);
                    }, angular.bind(deferred, errorHandler));
                    return deferred.promise;
                }
            }
        };
        return service;
    }
]);

'use strict';
/*global navigator, strata, uds, angular*/
angular.module('RedhatAccess.common').factory('udsService', [
    '$q',
    'RHAUtils',
    '$angularCacheFactory',
    function ($q, RHAUtils, $angularCacheFactory) {
        function mapResponseObject(isCase,isComment,isEntitlement,isUser,isSolution,response) {
            // we will also have to check for undefined and null objects in response before assigning.
            if(isCase === true) {
                var kase = {};
                kase.case_number = response.resource.caseNumber;
                kase.externalModelId=response.externalModelId;
                kase.status = {};
                kase.status.name = response.resource.status;
                kase.internalStatus = response.resource.internalStatus;
                kase.subject = response.resource.subject;
                if(RHAUtils.isNotEmpty(response.resource.summary)) {
                    kase.summary = {};
                    kase.summary.summaryText = response.resource.summary.resource.summary;
                    if(RHAUtils.isNotEmpty(response.resource.summary.resource.lastModifiedBy)) {
                        kase.summary.lastModifiedBy = response.resource.summary.resource.lastModifiedBy.resource.fullName;
                    }
                    if(RHAUtils.isNotEmpty(response.resource.summary.resource.lastModified)) {
                        kase.summary.lastModified = RHAUtils.formatDate(RHAUtils.convertToTimezone(response.resource.summary.resource.lastModified), 'MMM DD YYYY');
                    }
                }
                kase.severity = {};
                kase.severity.name = response.resource.severity;
                kase.product = response.resource.product.resource.line.resource.name;
                kase.externalLock = response.resource.externalLock;
                if(response.resource.product.resource.version != undefined) {
                    kase.version = response.resource.product.resource.version.resource.name;
                }
                kase.description = response.resource.description;
                kase.sbr_group = '';
                if(response.resource.sbrs !== undefined && response.resource.sbrs.length > 0) {
                    for(var i = 0; i < response.resource.sbrs.length; i++) {
                        kase.sbr_group = kase.sbr_group.concat(response.resource.sbrs[i]);
                        if(i < (response.resource.sbrs.length-1)) {
                            kase.sbr_group = kase.sbr_group.concat(' , ');
                        }
                    }
                }
                kase.type = '';
                kase.created_by = response.resource.createdBy.resource.fullName;
                kase.last_modified_by = response.resource.createdBy.resource.fullName;
                kase.internal_priority = response.resource.internalPriority;
                kase.is_fts_case = response.resource.isFTSCase;
                kase.account = {};
                kase.account.account_number = response.resource.account.resource.accountNumber;
                kase.account.is_strategic = response.resource.account.resource.strategic;
                kase.account.special_handling_required = response.resource.account.resource.specialHandlingRequired;
                kase.attachments={};
                kase.attachments=response.resource.fileAttachments;

                angular.forEach( kase.attachments, angular.bind(this, function (attachment) {
                    var lastModifiedDate = RHAUtils.convertToTimezone(attachment.resource.lastModified);
                    attachment.resource.sortModifiedDate = attachment.resource.lastModified;
                    attachment.resource.last_modified_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                    attachment.resource.last_modified_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                    var createdDate = RHAUtils.convertToTimezone(attachment.resource.created);
                    attachment.resource.created_date = RHAUtils.formatDate(createdDate, 'MMM DD YYYY');
                    attachment.resource.created_time = RHAUtils.formatDate(createdDate, 'hh:mm A Z');
                }));
                if(response.resource.resolution)
                {
                    kase.resolution=response.resource.resolution;
                }
                else
                {
                    kase.resolution='';
                }
                kase.liveChatTranscripts=[];
                if(response.resource.liveChatTranscripts)
                {
                    kase.liveChatTranscripts=response.resource.liveChatTranscripts;
                    angular.forEach(response.resource.liveChatTranscripts, angular.bind(this, function (chatTranscript) {
                        chatTranscript.comment_type="chat";
                        var lastModifiedDate = RHAUtils.convertToTimezone(chatTranscript.resource.created);
                        var modifiedDate = chatTranscript.resource.created;
                        chatTranscript.resource.sortModifiedDate = modifiedDate;
                        chatTranscript.resource.last_modified_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                        chatTranscript.resource.last_modified_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');

                    }));
                }

                kase.bomgarSessions=[];
                if(response.resource.remoteSessions)
                {
                    angular.forEach(response.resource.remoteSessions, angular.bind(this, function (bomgarSession) {
                        bomgarSession.comment_type="bomgar";
                        var lastModifiedDate = RHAUtils.convertToTimezone(bomgarSession.resource.created);
                        var modifiedDate = bomgarSession.resource.created;
                        bomgarSession.resource.sortModifiedDate = modifiedDate;
                        bomgarSession.resource.last_modified_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                        bomgarSession.resource.last_modified_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                        var seconds=(bomgarSession.resource.duration/1000)%60;
                        bomgarSession.resource.durationMins=((bomgarSession.resource.duration-seconds)/1000)/60;
                    }));
                    kase.bomgarSessions=response.resource.remoteSessions;
                }

                kase.entitlement={};
                if(RHAUtils.isNotEmpty(response.resource.entitlement)) {
                    kase.entitlement.name = response.resource.entitlement.resource.name;
                    kase.entitlement.status = response.resource.entitlement.resource.status;
                    kase.entitlement.service_level = response.resource.entitlement.resource.serviceLevel;
                }

                if(response.resource.negotiatedEntitlementProcess)
                {
                    kase.negotiatedEntitlement={};
                    kase.negotiatedEntitlement.active=response.resource.negotiatedEntitlementProcess.resource.active;
                    kase.negotiatedEntitlement.life_Case=response.resource.negotiatedEntitlementProcess.resource.lifeOfCase;
                    kase.negotiatedEntitlement.start_time=response.resource.negotiatedEntitlementProcess.resource.startTime;
                    kase.negotiatedEntitlement.target_date=response.resource.negotiatedEntitlementProcess.resource.targetDate;
                    kase.negotiatedEntitlement.violates_sla=response.resource.negotiatedEntitlementProcess.resource.violatesSla;
                }
                kase.sbt=response.resource.sbt;
                kase.target_date_time=response.resource.targetDate;
                kase.resourceLinks = response.resource.resourceLinks;
                kase.caseAssociates = response.resource.caseAssociates;
                if(RHAUtils.isNotEmpty(response.resource.owner)) {
                    kase.owner = response.resource.owner;
                }
                kase.contributors = [];
                kase.observers = [];
                kase.issueLinks = response.resource.issueLinks;

                return kase;
            } else if(isComment === true) {
                var comments = {};
                return comments;
            } else if(isEntitlement === true) {
                var entitlement = {};
                return entitlement;
            } else if(isUser === true) {
                var user = {};
                return user;
            } else if(isSolution == true) {
                var solutions = {};
                return solutions;
            }
        };
        var service = {
            cases: {
                list: function(uql,resourceProjection,limit,sortOption,onlyStatus) {
                    var deferred = $q.defer();
                    uds.fetchCases(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        uql,
                        resourceProjection,
                        limit,
                        sortOption,
                        onlyStatus
                    );
                    return deferred.promise;
                }
            },
            bomgar: {
                getSessionKey: function(caseId) {
                    var deferred = $q.defer();
                    uds.generateBomgarSessionKey(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        caseId
                    );
                    return deferred.promise;
                }
            },
            kase:{
                details: {
                    get: function(caseNumber) {
                        var deferred = $q.defer();
                        uds.fetchCaseDetails(
                            function (response) {
                                if (response.resource !== undefined) {
                                    response=mapResponseObject(true,false,false,false,false,response);
                                } else {
                                    response=[];
                                    deferred.reject("Unable to find case.");
                                }
                                var targetDate= RHAUtils.convertToTimezone(response.target_date_time);
                                response.target_date = RHAUtils.formatDate(targetDate, 'MMM DD YYYY hh:mm:ss A Z');
                                deferred.resolve(response);
                            },
                            function (error) {
                                deferred.reject(error);
                            },
                            caseNumber
                        );
                        return deferred.promise;
                    },
                    put: function(caseNumber,caseDetails){
                        var deferred = $q.defer();
                        uds.updateCaseDetails(
                            function (response) {
                                deferred.resolve(response);
                            },
                            function (error) {
                                deferred.reject(error);
                            },
                            caseNumber,
                            caseDetails
                        );
                        return deferred.promise;
                    }
                },
                comments: {
                    get: function (caseNumber) {
                        var deferred = $q.defer();
                        uds.fetchCaseComments(
                            function (response) {
                                angular.forEach(response, angular.bind(this, function (comment) {
                                    var lastModifiedDate = RHAUtils.convertToTimezone(comment.resource.lastModified);
                                    var modifiedDate = comment.resource.lastModified;
                                    comment.resource.sortModifiedDate = modifiedDate;
                                    comment.resource.last_modified_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                                    comment.resource.last_modified_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                                    var createdDate = RHAUtils.convertToTimezone(comment.resource.created);
                                    comment.resource.created_date = RHAUtils.formatDate(createdDate, 'MMM DD YYYY');
                                    comment.resource.created_time = RHAUtils.formatDate(createdDate, 'hh:mm A Z');
                                }));
                                deferred.resolve(response);
                            },
                            function (error) {
                                deferred.reject(error);
                            },
                            caseNumber
                        );
                        return deferred.promise;
                    },
                    post: {
                        private: function (caseNumber, commentText) {
                            var deferred = $q.defer();
                            uds.postPrivateComments(
                                function (response) {
                                    deferred.resolve(response);
                                },
                                function (error) {
                                    deferred.reject(error);
                                },
                                caseNumber,
                                commentText

                            );
                            return deferred.promise;
                        },
                        public: function (caseNumber, commentText) {
                            var deferred = $q.defer();
                            uds.postPublicComments(
                                function (response) {
                                    deferred.resolve(response);
                                },
                                function (error) {
                                    deferred.reject(error);
                                },
                                caseNumber,
                                commentText

                            );
                            return deferred.promise;
                        }
                    }
                },
                history:{
                    get: function(caseNumber) {
                        var deferred = $q.defer();
                        uds.fetchCaseHistory(
                            function (response) {
                                angular.forEach(response, angular.bind(this, function (history) {
                                    var createdDate = RHAUtils.convertToTimezone(history.resource.created);
                                    history.resource.created_date = RHAUtils.formatDate(createdDate, 'MMM DD YYYY');
                                    history.resource.created_time = RHAUtils.formatDate(createdDate, 'hh:mm A Z');
                                }));
                                deferred.resolve(response);
                            },
                            function (error) {
                                deferred.reject(error);
                            },
                            caseNumber
                        );
                        return deferred.promise;
                    }
                },
                lock: {
                    get: function(caseNumber) {
                        var deferred = $q.defer();
                        uds.getlock(
                            function (response) {
                                if (response.resource !== undefined) {
                                    response=mapResponseObject(true,false,false,false,false,response);
                                } else {
                                    response=[];
                                }
                                deferred.resolve(response);
                            },
                            function (error) {
                                deferred.reject(error);
                            },
                            caseNumber
                        );
                        return deferred.promise;

                    },
                    remove: function(caseNumber) {
                        var deferred = $q.defer();
                        uds.releaselock(
                            function (response) {
                                if (response.resource !== undefined) {
                                    response=mapResponseObject(true,false,false,false,false,response);
                                } else {
                                    response=[];
                                }
                                deferred.resolve(response);
                            },
                            function (error) {
                                deferred.reject(error);
                            },
                            caseNumber
                        );
                        return deferred.promise;

                    }


                }
            },
            account:{
                get:function(accountNumber){
                    var deferred = $q.defer();
                    uds.fetchAccountDetails(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        accountNumber
                    );
                    return deferred.promise;
                },
                notes:function(accountNumber){
                    var deferred = $q.defer();
                    uds.fetchAccountNotes(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        accountNumber
                    );
                    return deferred.promise;

                }
            },
            user:{
                get:function(uql){
                    var deferred = $q.defer();
                    uds.fetchUser(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        uql
                    );
                    return deferred.promise
                },
                details:function(ssoUsername){
                    var deferred = $q.defer();
                    uds.fetchUserDetails(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        ssoUsername
                    );
                    return deferred.promise;
                }
            }
        };
        return service;
    }
]);

'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.security').controller('SecurityController', [
    '$scope',
    'securityService',
    'SECURITY_CONFIG',
    function ($scope, securityService, SECURITY_CONFIG) {
        $scope.securityService = securityService;
        if (SECURITY_CONFIG.autoCheckLogin) {
            securityService.validateLogin(SECURITY_CONFIG.forceLogin);
        }
        $scope.displayLoginStatus = function () {
            return SECURITY_CONFIG.displayLoginStatus;
        };
    }
]);

'use strict';
angular.module('RedhatAccess.security').directive('rhaLoginstatus', function () {
    return {
        restrict: 'AE',
        scope: false,
        templateUrl: 'security/views/login_status.html'
    };
});
'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.security').factory('securityService', [
    '$rootScope',
    '$modal',
    'AUTH_EVENTS',
    '$q',
    'LOGIN_VIEW_CONFIG',
    'SECURITY_CONFIG',
    'strataService',
    'AlertService',
    'RHAUtils',
    function($rootScope, $modal, AUTH_EVENTS, $q, LOGIN_VIEW_CONFIG, SECURITY_CONFIG, strataService, AlertService, RHAUtils) {
        var service = {
            loginStatus: {
                isLoggedIn: false,
                verifying: false,
                userAllowedToManageCases: true,
                authedUser: {}
            },
            loginURL: SECURITY_CONFIG.loginURL,
            logoutURL: SECURITY_CONFIG.logoutURL,
            setLoginStatus: function(isLoggedIn, verifying, authedUser) {
                service.loginStatus.isLoggedIn = isLoggedIn;
                service.loginStatus.verifying = verifying;
                service.loginStatus.authedUser = authedUser;
                RHAUtils.userTimeZone=authedUser.timezone;
                service.userAllowedToManageCases();
            },
            clearLoginStatus: function() {
                service.loginStatus.isLoggedIn = false;
                service.loginStatus.verifying = false;
                service.loginStatus.userAllowedToManageCases = false;
                service.loginStatus.authedUser = {};
                RHAUtils.userTimeZone='';
            },
            setAccount: function(accountJSON) {
                service.loginStatus.account = accountJSON;
            },
            modalDefaults: {
                backdrop: 'static',
                keyboard: true,
                modalFade: true,
                templateUrl: 'security/views/login_form.html',
                windowClass: 'rha-login-modal'
            },
            modalOptions: {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?',
                backdrop: 'static'
            },
            userAllowedToManageCases: function() {
                var canManage = false;
                if(service.loginStatus.authedUser.rights !== undefined && (service.loginStatus.authedUser.is_entitled || RHAUtils.isNotEmpty(service.loginStatus.authedUser.account))){
                    for(var i = 0; i < service.loginStatus.authedUser.rights.right.length; i++){
                        if(service.loginStatus.authedUser.rights.right[i].name === 'portal_manage_cases' && service.loginStatus.authedUser.rights.right[i].has_access === true){
                            canManage = true;
                            break;
                        }
                    }
                }
                service.loginStatus.userAllowedToManageCases = canManage;
            },
            userAllowedToManageEmailNotifications: function(user) {
                if (RHAUtils.isNotEmpty(service.loginStatus.authedUser.account) && RHAUtils.isNotEmpty(service.loginStatus.authedUser.account) && service.loginStatus.authedUser.org_admin) {
                    return true;
                } else {
                    return false;
                }
            },
            userAllowedToManageGroups: function(user) {
                if (RHAUtils.isNotEmpty(service.loginStatus.authedUser.account) && RHAUtils.isNotEmpty(service.loginStatus.authedUser.account) && (!service.loginStatus.authedUser.account.has_group_acls || service.loginStatus.authedUser.account.has_group_acls && service.loginStatus.authedUser.org_admin)) {
                    return true;
                } else {
                    return false;
                }
            },
            userAllowedToManageDefaultGroups: function(user) {
                if (RHAUtils.isNotEmpty(service.loginStatus.authedUser.account) && RHAUtils.isNotEmpty(service.loginStatus.authedUser.account) && (service.loginStatus.authedUser.org_admin)) {
                    return true;
                } else {
                    return false;
                }
            },
            getBasicAuthToken: function() {
                var defer = $q.defer();
                var token = localStorage.getItem('rhAuthToken');
                if (token !== undefined && token !== '') {
                    defer.resolve(token);
                    return defer.promise;
                } else {
                    service.login().then(function(authedUser) {
                        defer.resolve(localStorage.getItem('rhAuthToken'));
                    }, function(error) {
                        defer.resolve(error);
                    });
                    return defer.promise;
                }
            },
            loggingIn: false,
            initLoginStatus: function() {
                service.loggingIn = true;
                var defer = $q.defer();
                var wasLoggedIn = service.loginStatus.isLoggedIn;
                service.loginStatus.verifying = true;
                strataService.authentication.checkLogin().then(angular.bind(this, function(authedUser) {
                    service.setAccount(authedUser.account);
                    service.setLoginStatus(true, false, authedUser);
                    service.loggingIn = false;
                    //We don't want to resend the AUTH_EVENTS.loginSuccess if we are already logged in
                    if (wasLoggedIn === false) {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    }
                    defer.resolve(authedUser.loggedInUser);
                }), angular.bind(this, function(error) {
                    service.clearLoginStatus();
                    AlertService.addStrataErrorMessage(error);
                    service.loggingIn = false;
                    defer.reject(error);
                }));
                return defer.promise;
            },
            validateLogin: function(forceLogin) {
                var defer = $q.defer();
                //var that = this;
                if (!forceLogin) {
                    service.initLoginStatus().then(function(username) {
                        defer.resolve(username);
                    }, function(error) {
                        defer.reject(error);
                    });
                    return defer.promise;
                } else {
                    service.initLoginStatus().then(function(username) {
                        defer.resolve(username);
                    }, function(error) {
                        service.login().then(function(authedUser) {
                            defer.resolve(authedUser.loggedInUser);
                        }, function(error) {
                            defer.reject(error);
                        });
                    });
                    return defer.promise;
                }
            },
            login: function() {
                return service.showLogin(service.modalDefaults, service.modalOptions);
            },
            logout: function() {
                strataService.authentication.logout();
                service.clearLoginStatus();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            },
            showLogin: function(customModalDefaults, customModalOptions) {
                //var that = this;
                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};
                //Map angular-ui modal custom defaults to modal defaults defined in service
                angular.extend(tempModalDefaults, service.modalDefaults, customModalDefaults);
                //Map modal.html $scope custom properties to defaults defined in service
                angular.extend(tempModalOptions, service.modalOptions, customModalOptions);
                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = [
                        '$scope',
                        '$modalInstance',
                        function($scope, $modalInstance) {
                            $scope.user = {
                                user: null,
                                password: null
                            };
                            $scope.status = {
                                authenticating: false
                            };
                            $scope.useVerboseLoginView = LOGIN_VIEW_CONFIG.verbose;
                            $scope.modalOptions = tempModalOptions;
                            $scope.modalOptions.ok = function(result) {
                                //Hack below is needed to handle autofill issues
                                //@see https://github.com/angular/angular.js/issues/1460
                                //BEGIN HACK
                                $scope.status.authenticating = true;
                                $scope.user.user = $('#rha-login-user-id').val();
                                $scope.user.password = $('#rha-login-password').val();
                                //END HACK
                                var resp = strataService.authentication.setCredentials($scope.user.user, $scope.user.password);
                                if (resp) {
                                    service.initLoginStatus().then(
                                        function(authedUser) {
                                            $scope.user.password = '';
                                            $scope.authError = null;
                                            try {
                                                $modalInstance.close(authedUser);
                                            } catch (err) {}
                                            $scope.status.authenticating = false;
                                        },
                                        function(error) {
                                            if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                                                $scope.$apply(function() {
                                                    $scope.authError = 'Login Failed!';
                                                });
                                            } else {
                                                $scope.authError = 'Login Failed!';
                                            }
                                            $scope.status.authenticating = false;
                                        }
                                    );
                                }else {
                                    $scope.authError = 'Login Failed!';
                                    $scope.status.authenticating = false;
                                }
                            };
                            $scope.modalOptions.close = function() {
                                $scope.status.authenticating = false;
                                $modalInstance.dismiss('User Canceled Login');
                            };
                        }
                    ];
                }
                return $modal.open(tempModalDefaults).result;
            }
        };
        return service;
    }
]);

angular.module('RedhatAccessCommon.template', ['common/views/403.html', 'common/views/404.html', 'common/views/alert.html', 'common/views/chatButton.html', 'common/views/header.html', 'common/views/title.html', 'common/views/treenode.html', 'common/views/treeview-selector.html', 'security/views/login_form.html', 'security/views/login_status.html']);

angular.module("common/views/403.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/views/403.html",
    "<div id=\"outageHead\" ng-show=\"(!securityService.loginStatus.userAllowedToManageCases || HeaderService.showPartnerEscalationError) &amp;&amp; !COMMON_CONFIG.isGS4\"><div id=\"errornoDirectSupport403\"><h1 translate=\"\">Support Subscription Required</h1><p translate=\"\">The credentials you provided are valid, but you do not have <b>direct support from Red Hat.</b></p><p translate=\"\">If you believe you should have permission to view this resource, please <a href=\"/support/contact/customerService.html\">contact Customer Service</a> for assistance. Your Red Hat login might not be associated with the right account for your organization, or there might be an issue with your subscription. Either way, Customer Service should be able to help you resolve the problem.</p></div></div>");
}]);

angular.module("common/views/404.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/views/404.html",
    "<div ng-show=\"HeaderService.pageLoadFailure &amp;&amp; securityService.loginStatus.userAllowedToManageCases &amp;&amp; !COMMON_CONFIG.isGS4\"><pre class=\"console\">    d8888   .d8888b.      d8888  \n" +
    "   d8P888  d88P  Y88b    d8P888  \n" +
    "  d8P 888  888    888   d8P 888  \n" +
    " d8P  888  888    888  d8P  888  \n" +
    "d88   888  888    888 d88   888  \n" +
    "8888888888 888    888 8888888888 \n" +
    "      888  Y88b  d88P       888  \n" +
    "      888   \"Y8888P\"        888  \n" +
    "<br />\n" +
    "<br /><span translate=\"\" class=\"console-error\">Not Found</span><p translate=\"\">The page you are looking for is not here. It might have been moved, removed, or had its name and address changed. It might otherwise be temporarily unavailable for technical reasons.</p></pre></div>");
}]);

angular.module("common/views/alert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/views/alert.html",
    "<div ng-hide=\"HeaderService.pageLoadFailure || !securityService.loginStatus.userAllowedToManageCases\"><a style=\"float: right\" ng-show=\"AlertService.alerts.length &gt; 1\" ng-href=\"\" ng-click=\"dismissAlerts()\">{{'Close messages'|translate}}</a><div alert=\"alert\" ng-repeat=\"alert in AlertService.alerts\" type=\"alert.type\" close=\"closeAlert($index)\"><span ng-show=\"alert.type==='info'\" ng-bind-html=\"alert.message\" class=\"icon-innov-prev alert-icon\"></span><span ng-hide=\"alert.type==='info'\">{{alert.message}}</span></div></div>");
}]);

angular.module("common/views/chatButton.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/views/chatButton.html",
    "<div ng-show=\"showChat\" class=\"chat\"><iframe style=\"display: none;\" ng-src=\"{{chatHackUrl}}\"></iframe><a ng-show=\"chatAvailable\" ng-click=\"openChatWindow()\" style=\"cursor: pointer\" class=\"link\">{{'Chat with Support'|translate}}&nbsp;<!--i.fa.fa-comments--></a><span ng-show=\"!chatAvailable\" disabled=\"disabled\">{{'Chat Offline'|translate}}&nbsp;<!--i.fa.fa-comments--></span></div>");
}]);

angular.module("common/views/header.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/views/header.html",
    "<div rha-403error=\"\"></div><div rha-404error=\"\"></div><div ng-show=\"HeaderService.sfdcIsHealthy\"></div><div rha-alert=\"\"></div><div ng-hide=\"failedToLoadCase || !securityService.loginStatus.userAllowedToManageCases\"><div ng-show=\"pageLoading\" class=\"spinner spinner-inline\"></div></div><div ng-hide=\"HeaderService.pageLoadFailure || !securityService.loginStatus.userAllowedToManageCases\" class=\"page-header\"><div ng-hide=\"page ===&quot;&quot;\" rha-titletemplate=\"\" page=\"{{page}}\"></div><div ng-show=\"page === &quot;caseView&quot;\">Filed on&nbsp;</div><div ng-show=\"securityService.loginStatus.isLoggedIn &amp;&amp; securityService.loginStatus.authedUser.has_chat &amp;&amp; CaseService.sfdcIsHealthy\" rha-chatbutton=\"\"></div></div><div rha-loginstatus=\"\"></div><div ng-show=\"!HeaderService.sfdcIsHealthy\" ng-bind-html=\"parseSfdcOutageHtml()\"></div>");
}]);

angular.module("common/views/title.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/views/title.html",
    "<h1 ng-show=\"COMMON_CONFIG.showTitle\" class=\"page-title\">{{getPageTitle()}}</h1>");
}]);

angular.module("common/views/treenode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/views/treenode.html",
    "<li class=\"rha-treeselector-node\">\n" +
    "    <div>\n" +
    "        <span class=\"icon\" ng-class=\"{collapsed: choice.collapsed, expanded: !choice.collapsed}\" ng-show=\"choice.children.length > 0\" ng-click=\"choice.collapsed = !choice.collapsed\">\n" +
    "        </span>\n" +
    "        <span class=\"label\" ng-if=\"choice.children.length > 0\" ng-class=\"folder\">{{choice.name}}\n" +
    "        </span>\n" +
    "        <span class=\"label\" ng-if=\"choice.children.length === 0\"  ng-click=\"choiceClicked(choice)\">\n" +
    "            <input type=\"checkbox\" ng-checked=\"choice.checked\">{{choice.name}}\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</li>");
}]);

angular.module("common/views/treeview-selector.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/views/treeview-selector.html",
    "<div ng-controller=\"TreeViewSelectorCtrl\">\n" +
    "	<div> {{'Choose File(s) To Attach:'|translate}} </div>\n" +
    "  <rha-choice-tree ng-model=\"attachmentTree\"></rha-choice-tree>\n" +
    "  <pre>{{attachmentTree| json}}</pre>\n" +
    "</div>");
}]);

angular.module("security/views/login_form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/views/login_form.html",
    "<div class=\"modal-header\" id=\"rha-login-modal-header\">\n" +
    "    <h3 translate>\n" +
    "        Sign into the Red Hat Customer Portal\n" +
    "    </h3>\n" +
    "</div>\n" +
    "<div class=\"container-fluid\">\n" +
    "    <div class=\"modal-body form-horizontal\" id=\"rha-login-modal-body\">\n" +
    "        <!--form ng-submit=\"modalOptions.ok()\"  method=\"post\"-->\n" +
    "        <div class=\"form-group\" ng-show='useVerboseLoginView'>\n" +
    "        {{'Red Hat Access makes it easy for you to self-solve issues, diagnose problems, and engage with us via the Red Hat Customer Portal. To access Red Hat Customer Portal resources, you must enter valid portal credentials.'|translate}}\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-danger\" ng-show=\"authError\">\n" +
    "            {{authError}}\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" id=\"rha-login-modal-user-id\">\n" +
    "            <label for=\"rha-login-user-id\" class=\" control-label\" translate>Red Hat Login</label>\n" +
    "            <div>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"rha-login-user-id\" placeholder=\"{{'Red Hat Login'|translate}}\"  ng-model=\"user.user\" required autofocus>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" id=\"rha-login-modal-user-pass\">\n" +
    "            <label for=\"rha-login-password\" class=\"control-label\" translate>Password</label>\n" +
    "            <div>\n" +
    "                <input type=\"password\" class=\"form-control\" id=\"rha-login-password\" placeholder=\"{{'Password'|translate}}\" ng-model=\"user.password\" required>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" style=\"font-size:smaller\" ng-show='useVerboseLoginView'>\n" +
    "            <strong>{{'Note:'|translate}}\n" +
    "                &nbsp;</strong>{{'Red Hat Customer Portal credentials differ from the credentials used to log into this product.'|translate}}\n" +
    "        </div>\n" +
    "\n" +
    "        <!--/form-->\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <div class=\"form-group\" id=\"rha-login-modal-buttons\">\n" +
    "            <span class=\"pull-right\">\n" +
    "                <button class=\"btn  btn-md cancel\" ng-click=\"modalOptions.close()\" type=\"submit\" translate>Cancel</button>\n" +
    "                <button class=\"btn btn-primary btn-md login\" ng-click=\"modalOptions.ok()\" type=\"submit\" translate ng-disabled=\"status.authenticating\">Sign in</button>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("security/views/login_status.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/views/login_status.html",
    "<div ng-controller = 'SecurityController' ng-show=\"displayLoginStatus()\">\n" +
    "	<div class=\"row\">\n" +
    "		<div class=\"col-sm-12\">\n" +
    "			<span ng-show=\"securityService.loginStatus.isLoggedIn\" class=\"pull-right rha-logged-in\"> {{'Logged into the Red Hat Customer Portal as'|translate}} {{securityService.loginStatus.authedUser.loggedInUser}} &nbsp;|&nbsp;\n" +
    "			    <span ng-if=\"securityService.logoutURL.length === 0\" ng-show=\"!securityService.loginStatus.verifying\">\n" +
    "			        <a href=\"\" ng-click=\"securityService.logout()\"> {{'Log Out'|translate}}</a>\n" +
    "			    </span>\n" +
    "			    <span ng-if=\"securityService.logoutURL.length > 0\" ng-show=\"!securityService.loginStatus.verifying\">\n" +
    "			        <a href=\"{{securityService.logoutURL}}\"> {{'Log Out'|translate}}</a>\n" +
    "			    </span>\n" +
    "			    <span ng-show=\"securityService.loginStatus.verifying\" >\n" +
    "			         {{'Log Out'|translate}}\n" +
    "			    </span>\n" +
    "			</span>\n" +
    "			<span ng-show=\"!securityService.loginStatus.isLoggedIn\" class=\"pull-right rha-logged-out\"> {{'Not Logged into the Red Hat Customer Portal'|translate}}&nbsp;|&nbsp;\n" +
    "			    <span ng-if=\"securityService.loginURL.length === 0\" ng-show=\"!securityService.loginStatus.verifying\">\n" +
    "			        <a href=\"\" ng-click=\"securityService.login()\"> {{'Log In'|translate}}</a>\n" +
    "			    </span>\n" +
    "			    <span ng-if=\"securityService.loginURL.length > 0\" ng-show=\"!securityService.loginStatus.verifying\">\n" +
    "			        <a href=\"{{securityService.loginURL}}\"> {{'Log In'|translate}}</a>\n" +
    "			    </span>\n" +
    "			    <span ng-show=\"securityService.loginStatus.verifying\">\n" +
    "			        {{'Log In'|translate}}\n" +
    "			    </span>\n" +
    "			</span>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
