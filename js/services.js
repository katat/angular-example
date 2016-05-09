'use strict';
/* Services */
angular.module('Services', ['ngResource'])
	//load fake problem data
	.factory('Problems', function($resource) {
		var resource = $resource('data/problems.json', {}, {
			query: {
				method: 'get',
				isArray: true
			}
		});
		var cache = [];
		return {
			getData: function(callback) {
				if (cache && cache.length > 0) {
					return callback(cache);
				}
				resource.query().$promise.then(function(data) {
					cache = data;
					callback(cache);
				});
			}
		};
	});
