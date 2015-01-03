require('sugar');
var EsClient = require('./es-client');
var recipeStore = require('./recipe-store');

exports = module.exports = (function metainfoStore() {

	var client = new EsClient('meta');

	function addKey(key, successCallback, errorCallback) {
		if(!key) {
			errorCallback('Key must be supplied.');
			return;
		}

		client.get('keys').then(function(keysObj) {
			var keys = keysObj.keys || [];

			keys.push(key);

			return client.create(keys).then(function(successMsg) {
				successCallback(successMsg);
			});

		}, function(errorMsg) {
			errorCallback(errorMsg);
		});
	}

	function getAllKeys(successCallback, errorCallback) {
		client.get('keys').then(function(keysObj) {
			successCallback(keysObj.keys);
		}, function(errorMsg) {
			errorCallback(errorMsg);
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