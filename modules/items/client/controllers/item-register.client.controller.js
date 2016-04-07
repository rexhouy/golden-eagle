(function () {
        'use strict';

        angular
                .module('items')
                .controller('ItemRegisterController', ItemRegisterController);

        ItemRegisterController.$inject = ['$scope', '$state', 'Authentication', 'itemResolve', '$timeout', '$http', '$location'];

        function ItemRegisterController ($scope, $state, Authentication, item, $timeout, $http, $location) {
                var vm = this;

                vm.item = item;
                vm.error = null;
                vm.form = {};
                vm.customer = {};
                vm.getCodeText = "获取手机验证码";

                vm.register = function(isValid) {
                        if (!isValid) {
                                $scope.$broadcast('show-errors-check-validity', 'vm.form.registerForm');
                                return false;
                        }
                        $http({
                                method: 'POST',
                                url: '/api/item/'+vm.item._id+'/register',
                                data: vm.customer
                        }).then(function successCallback(response) {
                                if (response.data.succeed) {
                                        $state.go('items.customer');
                                } else {
                                        alert(response.data.message);
                                }
                        });
                        return false;
                };

                var isCooldown = false;
                var countDownTimmer = function(cooldown) {
                        return function() {
                                if (cooldown == 0) {
                                        vm.getCodeText = "获取手机验证码";
                                        isCooldown = false;
                                } else {
                                        vm.getCodeText = "已发送("+cooldown+")";

                                        $timeout(countDownTimmer(cooldown - 1), 1000);
                                }
                        };
                };

                vm.getCode = function() {
                        if (isCooldown) {
                                return;
                        }
                        if (vm.form.registerForm.tel.$valid && vm.customer.captcha && vm.customer.captcha.length == 6) {
                                isCooldown = true;
                                $http({
                                        method: 'GET',
                                        url: '/api/item/send_code',
                                        params: vm.customer
                                }).then(function successCallback(response) {
                                        if (response.data.succeed) {
                                                countDownTimmer(60)();
                                        } else {
                                                alert(response.data.message);
                                                isCooldown = false;
                                        }
                                }, function errorCallback(response) {
                                        isCooldown = false;
                                });
                        } else {
                                $scope.$broadcast('show-errors-check-validity', 'vm.form.registerForm');
                        }
                };

                vm.captchaURL = '/api/item/captcha';
                vm.changeCaptcha = function() {
                        vm.captchaURL = '/api/item/captcha?_=' + new Date().getTime();
                };

        }
})();
