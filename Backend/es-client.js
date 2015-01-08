var request = require('superagent');
var q = require('q');
require('sugar');
var ConfigManager = require('./config-manager.js');

function EsClient(type, configManager) {
	this.configManager = configManager || new ConfigManager();

	var host = this.configManager.getConfigValue('elasticSearchUrl');
	this.baseUrl = 'http://{1}:9200/reciperepo/{2}/'.assign(host, type);
}

EsClient.prototype.create = function(item, id) {
	var deferred = q.defer();
	var baseUrl = this.baseUrl;

	var createItem = function(item, id) {
		request
			.post(baseUrl + id)
			.send(item)
			.end(function(err, res) {
				if(err || res.error) {
					var error = err || res.error.message;
					deferred.reject('Failed to create item: ' + error);
				}
				else {
					deferred.resolve('Item ' + id + ' created.');
				}
			});
	};

	if(id) {
		createItem(item, id);
	}
	else {
		request
			.get(baseUrl + '_search')
			.end(function(err, res) {
				if(err || res.error) {
					var error = err || res.error.message;
					deferred.reject('Failed to get all items: ' + error);
				}
				else {
					var ids = res.body.hits.hits.map(function(item) { return parseInt(item._id); });

					var id = 1;
					while(ids.indexOf(id) > -1) {
						id++;
					}
					
					item.id = id;

					createItem(item, id);
				}
			});
	}

	return deferred.promise;
};

EsClient.prototype.getAll = function() {
	var deferred = q.defer();

	request
		.get(this.baseUrl + '_search')
		.end(function(err, res) {
			if(err || res.error) {
				var error = err || res.error.message;
				deferred.reject('Failed to get all items: ' + error);
			}
			else {
				var items = res.body.hits.hits.map(function(hit) {
					return hit._source;
				});

				deferred.resolve(items);
			}
		});

	return deferred.promise;
};

EsClient.prototype.get = function(id) {
	var deferred = q.defer();

	request
		.get(this.baseUrl + id)
		.end(function(err, res) {
			if(err) {
				deferred.reject('Failed to get item with ID ' + id + ': ' + err);
			}
			else if(res.notFound) {
				deferred.resolve(null);
			}
			else if(res.error) {
				deferred.reject('Failed to get item with ID ' + id + ': ' + res.error);
			}
			else {
				deferred.resolve(res.body._source);
			}
		});

	return deferred.promise;
};

EsClient.prototype.update = function(id, item) {
	var deferred = q.defer();

	var baseUrl = this.baseUrl;
	this.get(id).then(function(existingItem) {
		if(!existingItem) {
			deferred.reject('Failed to update item with ID ' + id + ', because it does not exist.');
		}
		else {
			request
				.put(baseUrl + id)
				.send(item)
				.end(function(err, res) {
					if(err || res.error) {
						var error = err || res.error.message;
						deferred.reject('Failed to update item with ID ' + id + ': ' + error);
					}
					else {
						deferred.resolve('Item ' + id + ' updated.');
					}
				});
		}
	});

	return deferred.promise;
};

EsClient.prototype.remove = function(id) {
	var deferred = q.defer();

	var baseUrl = this.baseUrl;
	this.get(id).then(function(existingItem) {
		if(!existingItem) {
			deferred.reject('Failed to remove item with ID ' + id + ', because it does not exist.');
		}
		else {
			request
				.del(baseUrl + id)
				.end(function(err, res) {
					if(err || res.error) {
						var error = err || res.error.message;
						deferred.reject('Failed to delete item with ID ' + id + ': ' + error);
					}
					else {
						deferred.resolve('Item ' + id + ' removed.');
					}
				});
		}
	});

	return deferred.promise;
};

module.exports = EsClient;