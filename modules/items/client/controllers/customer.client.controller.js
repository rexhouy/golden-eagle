(function () {
        'use strict';

        angular
                .module('items')
                .controller('CustomersController', CustomersController);

        CustomersController.$inject = ['customerResolve', 'ItemsService', '$timeout'];

        function CustomersController(customer, ItemsService, $timeout) {
                var vm = this;

                var toReadable = function(time) {
                        var day = time / 86400000; // Days
                        var hours = time % 86400000 / 3600000; // Hours
                        var min = time % 3600000 / 60000;  // Munites
                        var sec = time % 60000 / 1000; // Seconds
                        day = Math.floor(day);
                        hours = Math.floor(hours);
                        min = Math.floor(min);
                        sec = Math.floor(sec);
                        var result = '';
                        if (day > 0) {
                                result += day + '天';
                        }
                        return result + hours + '时' + min + '分' + sec;
                };

                var countdownTimmer = function() {
                        var endTime = new Date(vm.item.endTime);
                        vm.item.timeLeft = toReadable(endTime - new Date());
                        $timeout(countdownTimmer, 1000);
                };

                vm.customer = customer;
                ItemsService.get({itemId: customer.item}, function(item) {
                        var size = 100 / (item.prices.length - 1);
                        item.prices.forEach(function(price, index) {
                                price.position = "left:" + size * index + "%;";
                        });

                        vm.item = item;

                        countdownTimmer();
                });
        }
})();
