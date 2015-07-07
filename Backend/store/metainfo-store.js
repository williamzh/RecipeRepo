var EsClient = require('./es-client');
var RecipeStore = require('./recipe-store');
var q = require('q');
var camelCase = require('camel-case');

function MetainfoStore(client, recipeStore) {
	this.client = client || new EsClient('meta');
	this.recipeStore = recipeStore || new RecipeStore();
}

MetainfoStore.prototype.setMetaData = function(id, value, successCallback, errorCallback) {
	if(!id || !value) {
		errorCallback('Id and value must be provided.');
		return;
	}

	value = camelCase(value);
	
	var client = this.client;
	var idGenerator = this.idGenerator;
	client.get(id)
		.then(function(metaData) {
			if(metaData) {
				// Don't do anything if value already exists
				if(metaData.values.indexOf(value) > -1) {
					successCallback('Value ' + value + ' already exists. Nothing updated.');
					var deferred = q.defer();
					return deferred.promise;
				}

				// If meta data exists, append the value
				metaData.values.push(value);
			}
			else {
				// Otherwise create a new meta data object with the value
				metaData = {
					id: id,
					values: [value]
				};
			}

			return client.create(metaData, id)
				.then(function(successMsg) {
					successCallback(successMsg);
				})
				.catch(function(errorMsg) {
					errorCallback(errorMsg);
				})
				.done();
		});
};

MetainfoStore.prototype.getAllMetaData = function(successCallback, errorCallback) {
	this.client.getAll().then(function(metaData) {
		// Convert array to object		
		var metaDataObj = {};
		metaData.each(function(md) {
			metaDataObj[md.id] = md.values;
		});

		successCallback(metaDataObj);
	})
	.catch(function(errorMsg) {
		errorCallback(errorMsg);
	})
	.done();
};

module.exports = MetainfoStore;