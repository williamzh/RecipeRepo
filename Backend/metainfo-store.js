var EsClient = require('./es-client');
var RecipeStore = require('./recipe-store');

function MetainfoStore(client, recipeStore) {
	this.client = client || new EsClient('meta');
	this.recipeStore = recipeStore || new RecipeStore();
}

MetainfoStore.prototype.addKey = function(key, successCallback, errorCallback) {
	if(!key) {
		errorCallback('Key must be supplied.');
		return;
	}

	var client = this.client;
	this.client.get('keys').then(function(keysObj) {
		keysObj = keysObj || { keys: [] };

		keysObj.keys.push(key);

		return client.create(keysObj).then(function(successMsg) {
			successCallback(successMsg);
		});

	}, function(errorMsg) {
		errorCallback(errorMsg);
	});
};

MetainfoStore.prototype.getAllKeys = function(successCallback, errorCallback) {
	this.client.get('keys').then(function(keysObj) {
		successCallback(keysObj.keys);
	}, function(errorMsg) {
		errorCallback(errorMsg);
	});
};

MetainfoStore.prototype.getValuesForKey = function(key, successCallback, errorCallback) {
	this.recipeStore.getAll(function(groupedRecipes) {
		successCallback(Object.keys(groupedRecipes));
	}, errorCallback, {
		groupBy: key
	});
};

module.exports = MetainfoStore;