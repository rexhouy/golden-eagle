(function () {
        'use strict';

        angular
                .module('items')
                .config(routeConfig);

        routeConfig.$inject = ['$stateProvider'];

        function routeConfig($stateProvider) {
                $stateProvider
                        .state('items', {
                                abstract: true,
                                url: '/items',
                                template: '<ui-view/>'
                        })
                        .state('items.list', {
                                url: '',
                                templateUrl: 'modules/items/views/list-items.client.view.html',
                                controller: 'ItemsListController',
                                controllerAs: 'vm',
                                data: {
                                        pageTitle: '商品列表'
                                }
                        })
                        .state('items.create', {
                                url: '/create',
                                templateUrl: 'modules/items/views/form-item.client.view.html',
                                controller: 'ItemsController',
                                controllerAs: 'vm',
                                resolve: {
                                        itemResolve: newItem
                                },
                                data: {
                                        roles: ['user', 'admin'],
                                        pageTitle : '创建'
                                }
                        })
                        .state('items.customer', {
                                url: '/register/result',
                                templateUrl: 'modules/items/views/register.result.client.view.html',
                                controller: 'CustomersController',
                                controllerAs: 'vm',
                                data:{
                                        noHistory: true,
                                        pageTitle: '我的参与信息'
                                }
                        })
                        .state('items.edit', {
                                url: '/:itemId/edit',
                                templateUrl: 'modules/items/views/form-item.client.view.html',
                                controller: 'ItemsController',
                                controllerAs: 'vm',
                                resolve: {
                                        itemResolve: getItem
                                },
                                data: {
                                        roles: ['user', 'admin'],
                                        pageTitle: 'Edit Item {{ itemResolve.name }}'
                                }
                        })
                        .state('items.register', {
                                url: '/:itemId/register',
                                templateUrl: 'modules/items/views/register.client.view.html',
                                controller: 'ItemRegisterController',
                                controllerAs: 'vm',
                                resolve: {
                                        itemResolve: getItem
                                },
                                data:{
                                        pageTitle: 'Item {{ itemResolve.name }}'
                                }
                        })
                        .state('items.statistics', {
                                url: '/statistics',
                                templateUrl: 'modules/items/views/statistics.client.view.html',
                                controller: 'StatisticsController',
                                controllerAs: 'vm',
                                data:{
                                        roles: ['user', 'admin'],
                                        pageTitle: '统计结果'
                                }
                        })
                        .state('items.itemStatistics', {
                                url: '/:itemId/statistics',
                                templateUrl: 'modules/items/views/item.statistics.client.view.html',
                                controller: 'ItemStatisticsController',
                                controllerAs: 'vm',
                                resolve: {
                                        itemResolve: getItem
                                },
                                data:{
                                        roles: ['user', 'admin'],
                                        pageTitle: '统计结果'
                                }
                        })
                        .state('items.view', {
                                url: '/:itemId',
                                templateUrl: 'modules/items/views/view-item.client.view.html',
                                controller: 'ItemsController',
                                controllerAs: 'vm',
                                resolve: {
                                        itemResolve: getItem
                                },
                                data:{
                                        pageTitle: 'Item {{ itemResolve.name }}'
                                }
                        });
        }

        getItem.$inject = ['$stateParams', 'ItemsService'];

        function getItem($stateParams, ItemsService) {
                return ItemsService.get({
                        itemId: $stateParams.itemId
                }).$promise;
        }

        getCustomer.$inject = ['$stateParams', 'CustomersService'];

        function getCustomer($stateParams, CustomersService) {
                return CustomersService.get({
                        customerId: $stateParams.customerId
                }).$promise;
        }

        newItem.$inject = ['ItemsService'];

        function newItem(ItemsService) {
                return new ItemsService();
        }
})();
