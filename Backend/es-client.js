var request = require('request');
var q = require('q');
var configManager = require('./config-manager.js');

function EsClient(type) {
	var host = configManager.getConfigValue('elasticSearchUrl');
	this.baseUrl = 'http://{1}:9200/reciperepo/{2}/'.assign(host, type);
}

EsClient.prototype.create = function(item) {
	var deferred = q.defer();

	var baseUrl = this.baseUrl;
	var config = {
		method: 'GET',
		url: baseUrl + '/_search'
	};
	request(config, function(error, response, data) {
		if(response.statusCode == 200) {
			var parsedData = JSON.parse(data);
			var ids = parsedData.hits.hits.map(function(item) { return parseInt(item._id); });

			var id = 1;
			while(ids.indexOf(id) > -1) {
				id++;
			}
			
			if(item.hasOwnProperty('id')) {
				item.id = id;
			}
			
			var postConfig = {
				method: 'POST',
				url: baseUrl + id,
				body: JSON.stringify(item)
			};

			request(postConfig, function(error, response, data) {
				if(response.statusCode == 200 || response.statusCode == 201) {
					deferred.resolve('Item ' + id + ' created.');
				}
				else {
					deferred.reject('Failed to create item: ' + error);
				}
			});
		}
		else {
			deferred.reject('Failed to get all items: ' + error);
		}
	});

	return deferred.promise;
};

EsClient.prototype.getAll = function() {
	var deferred = q.defer();

	var config = {
		method: 'GET',
		url: this.baseUrl + '/_search'
	};
	request(config, function(error, response, data) {
		if(response.statusCode == 200) {
			var parsedData = JSON.parse(data);
			var items = parsedData.hits.hits.map(function(hit) {
				return hit._source;
			});

			deferred.resolve(items);			
		}
		else {
			deferred.reject('Failed to get all items: ' + error);
		}
	});

	return deferred.promise;
};

EsClient.prototype.get = function(id) {
	var deferred = q.defer();

	var config = {
		method: 'GET',
		url: this.baseUrl + id
	};
	request(config, function(error, response, data) {
		if(response.statusCode == 200) {
			var parsedData = JSON.parse(data);
			deferred.resolve(parsedData._source);
		}
		else if(response.statusCode == 404) {
			deferred.resolve(null);
		}
		else {
			deferred.reject('Failed to get item with ID ' + id + ': ' + error);
		}
	});

	return deferred.promise;
};

EsClient.prototype.update = function(id, item) {
	var deferred = q.defer();

	this.get.then(function(existingItem) {
		if(!existingItem) {
			deferred.reject('Failed to update item with ID ' + id + ', because it does not exist.');
		}

		var config = {
			method: 'PUT',
			url: this.baseUrl + id,
			body: JSON.stringify(item)
		};
		request(config, function(error, response, data) {
			if(response.statusCode == 200) {
				deferred.resolve('Item ' + id + ' updated.');
			}
			else {
				deferred.reject('Failed to update item with ID ' + id + ': ' + error);
			}
		});
	});

	return deferred.promise;
};

EsClient.prototype.remove = function(id) {
	var deferred = q.defer();

	this.get.then(function(existingItem) {
		if(!existingItem) {
			deferred.reject('Failed to remove item with ID ' + id + ', because it does not exist.');
		}

		var config = {
			method: 'DELETE',
			url: this.baseUrl + id
		};
		request(config, function(error, response, data) {
			if(response.statusCode == 200) {
				deferred.resolve('Item ' + id + ' removed.');
			}
			else {
				deferred.reject('Failed to delete item with ID ' + id + ': ' + error);
			}
		});
	});

	return deferred.promise;
};

module.exports = EsClient;