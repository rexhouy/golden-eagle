(function () {
        'use strict';

        angular
                .module('items')
                .controller('CustomersController', CustomersController);

        CustomersController.$inject = ['$scope', 'CustomersService', 'ItemsService', '$timeout', '$stateParams', '$mdToast'];

        function CustomersController($scope, CustomersService, ItemsService, $timeout, $stateParams, $mdToast) {
                var vm = this;

                if ($stateParams.message) {
                        var toast = $mdToast.simple()
                                    .textContent($stateParams.message)
                                    .action('OK')
                                    .position("top")
                                    .highlightAction(false);
                        $mdToast.show(toast);
                }

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

                CustomersService.find().then(function(result) {
                        if (result == null) {
                                return;
                        }
                        var items = result.items;
                        for (var i = 0; i < items.length; i++) {
                                items[i] = setItemProgress(items[i]);
                                items[i] = setItemPrice(items[i]);
                        }
                        vm.items = items;
                });

                var setItemProgress = function(item) {
                        var size = 100 / (item.prices.length - 1);
                        var maxCount = 0;
                        item.prices.forEach(function(price, index) {
                                price.position = 'left:' + size * index + '%;';
                                if (price.count > maxCount) maxCount = price.count;
                        });
                        var progress = item.sales /  maxCount * 100;
                        progress = progress > 100 ? 100 : progress;
                        item.progress = progress + '%';
                        return item;
                };

                var setItemPrice = function(item) {
                        for (var i = 0; i < item.prices.length; i++) {
                                if (item.sales >= item.prices[i].count) {
                                        item.price = item.prices[i].amount;
                                }
                        }
                        return item;
                };
        }
})();
