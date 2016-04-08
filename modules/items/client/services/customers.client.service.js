//Items service used to communicate Items REST endpoints
(function () {
	'use strict';

	angular
		.module('items')
		.factory('CustomersService', CustomersService);

	CustomersService.$inject = ['$http', '$q'];

	function CustomersService($http, $q) {
		var self = this;

		self.find = function() {
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: '/api/customer'
			}).then(function successCallback(response) {
				deferred.resolve(response.data);
			});
			return deferred.promise;
		};

		self.findByItem = function(itemId) {
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: '/api/items/'+itemId+'/statistics'
			}).then(function successCallback(response) {
				deferred.resolve(response.data);
			});
			return deferred.promise;
		};

		return self;
	}


})();
