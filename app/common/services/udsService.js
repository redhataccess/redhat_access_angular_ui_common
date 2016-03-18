'use strict';
/*global navigator, strata, uds, angular*/
angular.module('RedhatAccess.common').factory('udsService', [
    '$q',
    'RHAUtils',
    '$angularCacheFactory',
    function ($q, RHAUtils, $angularCacheFactory) {
        var service = {
            cases: {
                list: function(uql,resourceProjection,limit,sortOption,onlyStatus) {
                    return  uds.fetchCases(uql,
                        resourceProjection,
                        limit,
                        sortOption,
                        onlyStatus
                    );
                },
                sbrs: function(){
                    return  uds.fetchCaseSbrs();
                }
            },
            bomgar: {
                getSessionKey: function(caseId) {
                    return uds.generateBomgarSessionKey(caseId);
                }
            },
            kase:{
                handlingSystem:{
                    set : function(caseNumber,handlingSystemArray){
                        return uds.setHandlingSystem(caseNumber,handlingSystemArray);
                    }
                },
                details: {
                    get: function(caseNumber) {
                        return uds.fetchCaseDetails(caseNumber);

                    },
                    put: function(caseNumber,caseDetails){
                        return  uds.updateCaseDetails(caseNumber,caseDetails);
                    }
                },
                nep: {
                    create: function(caseNumber, nep){
                        return uds.createCaseNep(caseNumber, nep);
                    },
                    update: function(caseNumber, nep){
                        return uds.updateCaseNep(caseNumber, nep);
                    },
                    remove: function(caseNumber){
                        return uds.removeCaseNep(caseNumber);
                    }
                },
                associates:{
                     get:function(uqlContributors){
                        return uds.fetchCaseAssociateDetails(uqlContributors);
                     },
                    post:function(caseId,userId,roleName)
                    {
                        var jsonAssociates=
                        {
                            "resource": {
                                "associate": {
                                    "externalModelId": userId

                                },
                                "role": roleName
                            }

                        };
                        return uds.addAssociates(caseId,
                            jsonAssociates
                        );

                    },
                    remove:function(caseId,associateId){
                        return uds.deleteAssociates(caseId,associateId);
                    },
                    update: function(caseId,userId,roleName,associateId){
                        var jsonAssociates=
                        {
                            "resource": {
                                "associate": {
                                    "externalModelId": userId

                                },
                                "role": roleName
                            },
                            "externalModelId": associateId
                        };
                        return uds.updateCaseAssociate(caseId,jsonAssociates);
                    }
                },
                comments: {
                    get: function (caseNumber) {
                        return uds.fetchCaseComments(caseNumber);

                    },
                    post: {
                        private: function (caseNumber, commentText, hoursWorked) {
                            return uds.postPrivateComments(caseNumber,
                                commentText,
                                hoursWorked

                            );
                        },
                        public: function (caseNumber, commentText, hoursWorked) {
                            return uds.postPublicComments( caseNumber,
                                commentText,
                                hoursWorked
                            );
                        }
                    },
                    put: {
                        private: function (caseNumber, commentText,caseCommentId,draft ) {
                            return uds.postEditPrivateComments(
                                caseNumber,
                                commentText,
                                caseCommentId,
                                draft

                            );
                        }

                    }
                },
                history:{
                    get: function(caseNumber) {
                        return  uds.fetchCaseHistory(caseNumber);

                    }
                },
                resourceLinks:{
                    get: function(solutionIdQuery) {
                        return  uds.fetchSolutionDetails(solutionIdQuery);
                    }
                },
                lock: {
                    get: function(caseNumber) {
                        return  uds.getlock(caseNumber);

                    },
                    remove: function(caseNumber) {
                        return uds.releaselock(caseNumber);
                    }
                },
                calls: {
                    get: function(caseNumber) {
                        return  uds.getCallLogsForCase(caseNumber);
                    }
                },
                sbt:{
                    get: function(uql) {
                        return uds.fetchCases(uql,null,null,null,true);
                    }
                }
            },
            account:{
                get:function(accountNumber){
                    return uds.fetchAccountDetails(accountNumber);
                },
                notes:function(accountNumber){
                    return  uds.fetchAccountNotes(accountNumber);
                },
                openCases:function(uql){
                    return uds.getOpenCasesForAccount(uql);
                },
                avgCSAT:{
                    get:function(uql){
                        return uds.getAvgCSATForAccount(uql);
                    }
                },
                getCaseContacts:function(accountNumber){
                    return uds.getCaseContactsForAccount(accountNumber);
                },
                getCaseGroups: function(contactSSO){
                    return uds.getCaseGroupsForContact(contactSSO);
                },
                rmeCount:{
                    get:function(uql){
                        return uds.getRMECountForAccount(uql);
                    }
                }
            },
            user:{
                get:function(uql,resourceProjection){
                    return uds.fetchUser(uql,
                        resourceProjection
                    );
                },
                details:function(ssoUsername){
                    return uds.fetchUserDetails(ssoUsername);
                }
            },
            cqi: {
                questions: {
                    get: function(caseNumber){
                        return uds.getCQIQuestions(
                            caseNumber
                        );
                    }
                },
                score: {
                    put : function(caseNumber,reviewData){
                        return  uds.postCQIScore(
                            caseNumber,
                            reviewData
                        );
                    }
                }
            },
            reviews: {
                dependencies: {
                    get: function(){
                        return uds.getQuestionDependencies();
                    }
                }
            },
            solution: {
                details:{
                    get: function(solutionNumber, resourceProjection){
                        return  uds.getSolutionDetails(
                            solutionNumber,
                            resourceProjection
                        );
                    }
                },
                sqi: {
                    questions: {
                        get: function(solutionNumber){
                            return uds.getSQIQuestions(solutionNumber);
                        }
                    },
                    score: {
                        put : function(solutionNumber,reviewData){
                            return uds.postSQIScore( solutionNumber,
                                reviewData
                            );
                        }
                    }
                },
                pinSolution:function(caseNumber,solutionJson){
                    return  uds.pinSolutionToCase(caseNumber,solutionJson);
                }
            },
            sbr: {
                list: function(resourceProjection, query) {
                   return uds.getSbrList(resourceProjection,
                        query
                    );
                },
                removeUserSbr: function(userId,query){
                   return uds.removeUserSbr(userId,
                        query
                    );
                },
                user: {
                    put: function(userId, uql, data){
                       return uds.postAddUsersToSBR(userId,
                            uql,
                            data
                        );
                    }
                }
            },
            roles: {
                list: function(query) {
                   return uds.getRoleList(query
                    );
                },
                removeUserRole: function(userId,query){
                   return uds.removeUserRole(userId,
                        query
                    );
                },
                postRoleLevel: function(userId,roleName,roleLevel){
                    return uds.postRoleLevel(userId,roleName,roleLevel);
                },
                user: {
                    put: function(userId, uql, data){
                        return uds.postAddUsersToRole(
                            userId,
                            uql,
                            data
                        );
                    }
                }
            }
        };
        return service;
    }
]);
