var request = require('superagent');
var q = require('q');
require('sugar');
var ConfigManager = require('./config-manager.js');
var IdGenerator = require('./utils/id-generator.js');

function EsClient(type, configManager, idGenerator) {
	this.configManager = configManager || new ConfigManager();
	this.idGenerator = idGenerator || new IdGenerator();

	var host = this.configManager.getConfigValue('elasticSearchUrl');
	this.baseUrl = 'http://{1}:9200/reciperepo/{2}/'.assign(host, type);
}

/**
 * Creates a new item (document) in the current type. If an ID is provided, it will be used
 * to index the new document. Otherwise, a unique ID will be generated automatically.
 * @param {Object} The new item to index.
 * @param {Number} (optional) A numeric ID used to index the new item.
 * @returns {Promise} A promise that returns a success/error message.
 */
EsClient.prototype.create = function(item, id) {
	var deferred = q.defer();
	var baseUrl = this.baseUrl;
	var self = this;

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

					item.id = self.idGenerator.generateId(ids);

					createItem(item, item.id);
				}
			});
	}

	return deferred.promise;
};

/**
 * Retrieves all documents for the current type. The documents will be stripped of any
 * ElasticSearch meta data.
 * @returns {Promise} A promise that returns an array of all documents.
 */
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

/**
 * Retrieves the document that matches the supplied ID (without ElasticSearch meta data).
 * @param {Number} The ID of the document to retrieve.
 * @returns {Promise} A promise that returns a matching document, or null of no
 * match was found.
 */
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

/**
 * Updates an existing document that matches the supplied ID. 
 * @param {Number} The ID of the document to update.
 * @param {Object} The new document.
 * @returns {Promise} A promise that returns a success/error message.
 */
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

/**
 * Removes an existing document that matches the supplied ID. 
 * @param {Number} The ID of the document to remove.
 * @returns {Promise} A promise that returns a success/error message.
 */
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

/**
 * Performs a free text search with the supplied query and fields. 
 * @param {String} The search query.
 * @param {Array} An array of field names that should be used in the search.
 * @returns {Promise} A promise that returns an array of search results (documents).
 */
EsClient.prototype.search = function(query, fields) {
	var deferred = q.defer();

	request
		.post(this.baseUrl + '_search')
		.send({
			query: {
		        multi_match: {
		        	query: query,
		        	type : "phrase_prefix",
		        	fields: fields,
		        	max_expansions: 50
		    	}
	    	}
	    })
		.end(function(err, res) {
			if(err || res.error) {
				var error = err || res.error.message;
				deferred.reject('Search with query ' + query + ' failed: ' + error);
			}
			else {
				var hits = res.body.hits.hits.map(function(hit) {
					return hit._source;
				});
				deferred.resolve(hits);
			}
		});

	return deferred.promise;
};

module.exports = EsClient;