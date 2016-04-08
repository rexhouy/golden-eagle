(function () {
        'use strict';

        angular
                .module('items')
                .controller('ItemStatisticsController', ItemStatisticsController);

        ItemStatisticsController.$inject = ['$scope', '$state', 'Authentication', 'itemResolve', 'CustomersService'];

        function ItemStatisticsController ($scope, $state, Authentication, item, CustomersService) {
                var vm = this;

                vm.authentication = Authentication;

                vm.item = item;

                CustomersService.findByItem(item._id).then(function(result) {
                        if (result.succeed) {
                                vm.customers = result.customers;
                        }
                });

        }
})();
