var request = require('request');
require('sugar');
var configManager = require('./config-manager');

exports = module.exports = (function metainfoStore() {

	var host = configManager.getConfigValue('elasticSearchUrl');

	function addKey(key, successCallback, errorCallback) {
		if(!key) {
			errorCallback('Key must be supplied.');
			return;
		}

		var config = {
			url: 'http://{1}:9200/reciperepo/meta/keys'.assign(host),
			method: 'GET'
		};

		request(config, function(error, response, data) {
			if(response.statusCode !== 200) {
				errorCallback('Failed to add key. ' + error);
				return;
			}
			
			var keys = JSON.parse(data)._source.keys || [];

			if(keys.indexOf(key) > -1) {
				errorCallback('Key ' + key + ' already exists.');
				return;
			}

			keys.push(key);

			var config = {
				url: 'http://{1}:9200/reciperepo/meta/keys'.assign(host),
				method: 'POST',
				body: JSON.stringify(keys)
			};

			request(config, function(error, response, data) {
				if(!error && response.statusCode == 201) {
					successCallback('Key successfully added.');
				}
				else {
					errorCallback('Failed to add key. ' + error);
				}
			});
		});
	}

	function getAllKeys(successCallback, errorCallback) {
		var config = {
			url: 'http://{1}:9200/reciperepo/meta/keys'.assign(host),
			method: 'GET'
		};

		request(config, function(error, response, data) {
			if(!error && response.statusCode == 200) {
				var parsedData = JSON.parse(data);
				var recipes = parsedData.hits.hits.map(function(hit) {
					return hit._source.keys;
				});
				
				successCallback(recipes);
				return;
			}
			else {
				errorCallback(error);
			}
		});
	}

	return {
		getAll: getAllKeys,
		add: addKey
	}
})();