(function () {
        'use strict';

        angular
                .module('items')
                .controller('ItemStatisticsController', ItemStatisticsController);

        ItemStatisticsController.$inject = ['$scope', '$state', 'Authentication', 'itemResolve', 'CustomersService'];

        function ItemStatisticsController ($scope, $state, Authentication, item, CustomersService) {
                var vm = this;

                vm.authentication = Authentication;



                var setItemPrice = function(item) {
                        for (var i = 0; i < item.prices.length; i++) {
                                if (item.sales >= item.prices[i].count) {
                                        item.price = item.prices[i].amount;
                                }
                        }
                        return item;
                };

                item = setItemPrice(item);
                vm.item = item;

                CustomersService.findByItem(item._id).then(function(result) {
                        if (result.succeed) {
                                vm.customers = result.customers;
                        }
                });

        }
})();
