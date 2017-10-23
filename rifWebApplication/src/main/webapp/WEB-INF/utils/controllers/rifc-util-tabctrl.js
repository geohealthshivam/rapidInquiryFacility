/**
 * The Rapid Inquiry Facility (RIF) is an automated tool devised by SAHSU 
 * that rapidly addresses epidemiological and public health questions using 
 * routinely collected health and population data and generates standardised 
 * rates and relative risks for any given health outcome, for specified age 
 * and year ranges, for any given geographical area.
 *
 * Copyright 2016 Imperial College London, developed by the Small Area
 * Health Statistics Unit. The work of the Small Area Health Statistics Unit 
 * is funded by the Public Health England as part of the MRC-PHE Centre for 
 * Environment and Health. Funding for this project has also been received 
 * from the United States Centers for Disease Control and Prevention.  
 *
 * This file is part of the Rapid Inquiry Facility (RIF) project.
 * RIF is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * RIF is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with RIF. If not, see <http://www.gnu.org/licenses/>; or write 
 * to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, 
 * Boston, MA 02110-1301 USA
 
 * David Morley
 * @author dmorley
 */

/* 
 * CONTROLLER to handle tab transitions, logout and alert on new study completion
 */
angular.module("RIF")
        .controller('TabCtrl', ['$scope', 'user', '$injector', '$uibModal', '$interval', '$rootScope',
            function ($scope, user, $injector, $uibModal, $interval, $rootScope) {

                //The user to display
                $scope.username = user.currentUser;

                //Check for update in status every x ms Seconds
                var ms = 4000;
                var stop;
                var studies;
                $scope.studyIds;

                //In DEBUG set false to keep Tomcat console clear
                var bPoll = true;

                stop = $interval(function () {
                    if (bPoll) {
						/*
						 * Ignore:
						 *	C: created, not verified; 
						 *	V: verified, but no other work done; [NOT USED BY MIDDLEWARE]
						 *	E: extracted imported or created, but no results or maps created; 
						 *	R: initial results population, create map table; [NOT USED BY MIDDLEWARE] design]
						 *	W: R warning. [NOT USED BY MIDDLEWARE]
						 * Handle:
						 *
						 *	G: Extract failure, extract, results or maps not created;
						 *	S: R success;
						 *	F: R failure, R has caught one or more exceptions [depends on the exception handler
						 */	
                        user.getCurrentStatusAllStudies(user.currentUser).then(function (res) {
                            studies = res.data.smoothed_results;
                            var check = [];
                            for (var i = 0; i < studies.length; i++) {
                                if (studies[i].study_state === "S") {
                                    check.push(studies[i].study_id);
                                }
                            }
                            if (angular.isUndefined($scope.studyIds)) {
                                $scope.studyIds = angular.copy(check);
                            } else {
                                if (check.length === ($scope.studyIds.length + 1)) {
                                    var s = arrayDifference(check, $scope.studyIds);
                                    var name = "";
                                    for (var i = 0; i < studies.length; i++) {
                                        if (studies[i].study_id === s[0]) {
                                            name = studies[i].study_name;
                                            break;
                                        }
                                    }
                                    $scope.showSuccess("Study " + s + " - " + name + " has been processed");
                                    $scope.studyIds = angular.copy(check);

                                    //update study lists in other tabs
                                    $rootScope.$broadcast('updateStudyDropDown', {study_id: s[0], name: name});
                                }
                            }
                        });
                    }
                }, ms);

                function arrayDifference(source, target) {
                    return source.filter(function (current) {
                        return target.indexOf(current) === -1;
                    });
                }

                $scope.hamburger = function () {
                    var x = document.getElementById("myTopnav");
                    if (x.className === "topnav") {
                        x.className += " responsive";
                    } else {
                        x.className = "topnav";
                    }
                };

                $scope.$on('$destroy', function () {
                    if (!angular.isUndefined(stop)) {
                        $interval.cancel(stop);
                        stop = undefined;
                    }
                });

                //yes-no modal for $scope.logout
                $scope.openLogout = function () {
                    $scope.modalHeader = "Log out";
                    $scope.modalBody = "Unsaved work will be lost. Are you sure?";
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'utils/partials/rifp-util-yesno.html',
                        controller: 'ModalLogoutYesNoInstanceCtrl',
                        windowClass: 'stats-Modal',
                        backdrop: 'static',
                        scope: $scope,
                        keyboard: false
                    });
                };

                $scope.logout = function () {
                    $scope.openLogout();
                };
                $scope.doLogout = function () {
                    user.logout(user.currentUser).then(handleLogout, handleLogout);
                };
                function handleLogout(res) {
                    $injector.get('$state').transitionTo('state0');
                }
            }])
        .controller('ModalLogoutYesNoInstanceCtrl',
                function ($scope, $uibModalInstance) {
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    };
                    $scope.submit = function () {
                        $scope.doLogout();
                        $uibModalInstance.close();
                    };
                });