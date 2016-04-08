(function () {
        'use strict';

        angular
                .module('items')
                .factory('StatisticsService', StatisticsService);

        StatisticsService.$inject = ['$http', '$q'];

        function StatisticsService($http, $q) {
                var self = this;

                self.loadData = function() {
                        var deferred = $q.defer();
                        $http({
                                method: 'GET',
                                url: '/api/items/statistics'
                        }).then(function successCallback(response) {
                                deferred.resolve(response.data);
                        });
                        return deferred.promise;
                };

                return self;
        }


})();
