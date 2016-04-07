//Items service used to communicate Items REST endpoints
(function () {
	'use strict';

	angular
		.module('items')
		.factory('CustomersService', CustomersService);

	CustomersService.$inject = ['$resource'];

	function CustomersService($resource) {
		return $resource('api/customers/:customerId', {
			customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}


})();
