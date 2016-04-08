(function () {
        'use strict';

        angular
                .module('items')
                .controller('StatisticsController', StatisticsController);

        StatisticsController.$inject = ['$scope', '$state', 'Authentication', 'StatisticsService', 'ItemsService', 'CustomersService'];

        function StatisticsController ($scope, $state, Authentication, StatisticsService, ItemsService, CustomersService) {
                var vm = this;

                vm.authentication = Authentication;

                StatisticsService.loadData().then(function(response) {
                        if (response.succeed) {
                                vm.total = response.count;
                        }
                });

                ItemsService.query(function(items) {
                        vm.items = items;
                });

        }
})();
