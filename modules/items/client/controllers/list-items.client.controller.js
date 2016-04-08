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
                        // sec = Math.floor(sec);
                        var result = '';
                        if (day > 0) {
                                result += day + '天';
                        }
                        return result + hours + '时' + min + '分';
                };

                var countdownTimmer = function() {
                        var endTime = new Date();
                        endTime.setFullYear(2016);
                        endTime.setMonth(3);
                        endTime.setDate(19);
                        endTime.setHours(0);
                        endTime.setMinutes(0);
                        endTime.setSeconds(0);
                        if (new Date() > endTime) {
                                vm.end = true;
                        }
                        vm.timeLeft = toReadable(endTime - new Date());
                        $timeout(countdownTimmer, 10000);
                };

                vm.items = ItemsService.query(function() {
                        countdownTimmer();
                });

                var count = 0;
                vm.imageLoaded = function() {
                        if (++count >= vm.items.length) {
                                vm.initialized = true;
                        }
                };
        }
})();
