(function () {
        'use strict';

        angular
                .module('items')
                .controller('ItemsListController', ItemsListController);

        ItemsListController.$inject = ['ItemsService', '$timeout'];

        function ItemsListController(ItemsService, $timeout) {
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
                        vm.items.forEach(function(item, index) {
                                var endTime = new Date(item.endTime);
                                item.timeLeft = toReadable(endTime - new Date());
                                $timeout(countdownTimmer, 1000);
                        });
                };

                vm.items = ItemsService.query(function() {
                        // countdownTimmer();
                        vm.initialized = true;
                });
        }
})();
