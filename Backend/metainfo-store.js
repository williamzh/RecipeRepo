var EsClient = require('./es-client');
var IdGenerator = require('./utils/id-generator');
var RecipeStore = require('./recipe-store');

function MetainfoStore(client, idGenerator, recipeStore) {
	this.client = client || new EsClient('meta');
	this.idGenerator = idGenerator || new IdGenerator();
	this.recipeStore = recipeStore || new RecipeStore();
}

MetainfoStore.prototype.addMetaData = function(id, value, successCallback, errorCallback) {
	if(!id || !value) {
		errorCallback('Id and value must be provided.');
		return;
	}
	
	var client = this.client;
	var idGenerator = this.idGenerator;
	client.get(id)
		.then(function(metaData) {
			if(metaData) {
				// If meta data already exists, append the values
				var valueIds = Object.keys(metaData.values).map(function(val) { return parseInt(val); });
				var valueId = idGenerator.generateId(valueIds, true);
				
				metaData.values[valueId] = {
					name: value
				};
			}
			else {
				// Otherwise create a new meta data object
				metaData = {
					values: {}
				};

				var valueId = idGenerator.generateId().toString();
				metaData.id = id;
				metaData.values[valueId] = {
					name: value
				};
			}

			return client.create(metaData, id);
		})
		.then(function(successMsg) {
			successCallback(successMsg);
		})
		.catch(function(errorMsg) {
			errorCallback(errorMsg);
		})
		.done();
};

MetainfoStore.prototype.getAllMetaData = function(successCallback, errorCallback) {
	this.client.getAll().then(function(metaData) {
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

// MetainfoStore.prototype.getValuesForKey = function(key, successCallback, errorCallback) {
// 	this.client.get(key).then(function(metaData) {
// 		successCallback(metaData.values);
// 	})
// 	.catch(function(errorMsg) {
// 		errorCallback(errorMsg);
// 	})
// 	.done();

// 	// this.recipeStore.getAll(function(groupedRecipes) {
// 	// 	successCallback(Object.keys(groupedRecipes));
// 	// }, errorCallback, {
// 	// 	groupBy: key
// 	// });
// };

module.exports = MetainfoStore;