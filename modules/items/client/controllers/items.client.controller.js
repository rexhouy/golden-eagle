(function () {
        'use strict';

        // Items controller
        angular
                .module('items')
                .controller('ItemsController', ItemsController);

        ItemsController.$inject = ['$scope', '$state', 'Authentication', 'itemResolve', 'FileUploader'];

        function ItemsController ($scope, $state, Authentication, item, FileUploader) {
                var vm = this;

                /**
                 * File upload
                 */
                var uploader = $scope.uploader = new FileUploader({
                        url: '/api/item/upload'
                });
                uploader.filters.push({
                        name: 'imageFilter',
                        fn: function(item /*{File|FileLikeObject}*/, options) {
                                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                        }
                });
                uploader.onAfterAddingFile = function(fileItem) {
                        $scope.uploadStarted = true;
                        $scope.uploadItem = uploader.queue[0].item;
                        uploader.queue.forEach(function(item, index) {
                                item.upload();
                        });
                };
                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                        vm.item.img = response.path;
                        $scope.uploadSucceed = true;
                };

                vm.authentication = Authentication;
                vm.item = item;
                vm.error = null;
                vm.form = {};
                vm.remove = remove;
                vm.edit = edit;
                vm.save = save;

                vm.item.startTime = vm.item.startTime == null ? new Date() : new Date(vm.item.startTime);
                vm.item.endTime = vm.item.endTime == null ? new Date() : new Date(vm.item.endTime);
                vm.item.prices = vm.item.prices || [];
                if (vm.item.length == 0) {
                        vm.item.prices.push({amount: null, count: null});
                }

                vm.removePriceInfo = function(index) {
                        vm.item.prices.splice(index, 1);
                };

                vm.addPriceInfo = function() {
                        vm.item.prices.push({amount: null, count: null});
                };

                // Remove existing Item
                function remove() {
                        if (confirm('Are you sure you want to delete?')) {
                                vm.item.$remove($state.go('items.list'));
                        }
                }

                function edit() {
                        $state.go('items.edit');
                }

                // Save Item
                function save(isValid) {
                        if (!isValid) {
                                $scope.$broadcast('show-errors-check-validity', 'vm.form.itemForm');
                                return false;
                        }

                        // TODO: move create/update logic to service
                        if (vm.item._id) {
                                vm.item.$update(successCallback, errorCallback);
                        } else {
                                vm.item.$save(successCallback, errorCallback);
                        }

                        function successCallback(res) {
                                $state.go('items.view', {
                                        itemId: res._id
                                });
                        }

                        function errorCallback(res) {
                                vm.error = res.data.message;
                        }
                };
        }
})();
