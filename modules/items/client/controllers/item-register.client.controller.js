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
                vm.getCodeText = "获取验证码";

                vm.register = function(isValid) {
                        if (!isValid) {
                                return false;
                        }
                        $http({
                                method: 'POST',
                                url: '/api/item/'+vm.item._id+'/register',
                                data: vm.customer
                        }).then(function successCallback(response) {
                                if (!response.data.succeed) {
                                        alert(response.data.message);
                                }
                                $state.go('items.customer');
                        });
                        return false;
                };

                vm.isCooldown = false;
                var countDownTimmer = function(cooldown) {
                        return function() {
                                if (cooldown == 0) {
                                        vm.getCodeText = "获取验证码";
                                        vm.isCooldown = false;
                                } else {
                                        vm.getCodeText = "已发送("+cooldown+")";

                                        $timeout(countDownTimmer(cooldown - 1), 1000);
                                }
                        };
                };

                vm.getCode = function() {
                        if (vm.isCooldown) {
                                return;
                        }
                        if (vm.form.registerForm.$valid) {
                                vm.isCooldown = true;
                                $http({
                                        method: 'GET',
                                        url: '/api/item/send_code',
                                        params: vm.customer
                                }).then(function successCallback(response) {
                                        if (response.data.succeed) {
                                                countDownTimmer(60)();
                                        } else {
                                                alert(response.data.message);
                                                vm.isCooldown = false;
                                        }
                                }, function errorCallback(response) {
                                        vm.isCooldown = false;
                                });
                        } else {
                                vm.form.registerForm.$setSubmitted();
                                return;
                        }
                };

                vm.captchaURL = '/api/item/captcha';
                vm.changeCaptcha = function() {
                        vm.captchaURL = '/api/item/captcha?_=' + new Date().getTime();
                };

        }
})();
