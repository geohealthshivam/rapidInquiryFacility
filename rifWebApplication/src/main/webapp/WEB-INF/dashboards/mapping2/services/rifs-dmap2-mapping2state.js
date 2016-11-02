/* 
 * SERVICE to store state of mapping tab
 */
angular.module("RIF")
        .factory('Mapping2StateService',
                function () {
                    var s = {
                        vSplit1: 25,
                        hSplit1: 75
                    };
                    var defaults = angular.copy(JSON.parse(JSON.stringify(s)));
                    return {
                        getState: function () {
                            return s;
                        },
                        resetState: function () {
                            s = angular.copy(defaults);
                        }
                    };
                });