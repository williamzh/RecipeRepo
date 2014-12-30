var request = require('request');
require('sugar');
var configManager = require('./config-manager');
var recipeStore = require('./recipe-store');

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
				body: JSON.stringify({ keys: keys })
			};

			request(config, function(error, response, data) {
				if(!error && response.statusCode == 200) {
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
				var keys = parsedData._source.keys;

				successCallback(keys);
				return;
			}
			else {
				errorCallback(error);
			}
		});
	}

	function getValuesForKey(key, successCallback, errorCallback) {
		recipeStore.getAll(function(groupedRecipes) {
			successCallback(Object.keys(groupedRecipes));
		}, errorCallback, {
			groupBy: key
		});
	}

	return {
		getAllKeys: getAllKeys,
		addKey: addKey,
		getValuesForKey: getValuesForKey
	}
})();