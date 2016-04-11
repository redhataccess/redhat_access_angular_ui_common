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
                name: gettextCatalog.getString('Case Status (Z-A)'),
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


        this.wappsUrl = new Uri('https://ams-dev2.devlab.redhat.com/wapps');
        if (window.location.hostname === 'access.redhat.com' || window.location.hostname === 'prod.foo.redhat.com' || window.location.hostname === 'fooprod.redhat.com'){
            this.wappsUrl = new Uri('https://www.redhat.com/wapps');
        }
        else
        {
            if (window.location.hostname === 'access.qa.redhat.com' || window.location.hostname === 'qa.foo.redhat.com' || window.location.hostname === 'fooqa.redhat.com') {
                this.wappsUrl = new Uri('https://www.qa.redhat.com/wapps');
            }
            else
            {
                if (window.location.hostname === 'access.devgssci.devlab.phx1.redhat.com' || window.location.hostname === 'ci.foo.redhat.com' || window.location.hostname === 'fooci.redhat.com') {
                    this.wappsUrl = new Uri('https://ams-dev2.devlab.redhat.com/wapps');
                }
            }
        }
    }
]);
