var DbClient = require('../data/db-client');
var q = require('q');
require('sugar');

function MetainfoStore(dbClient) {
	this.dbClient = dbClient || new DbClient();
	this.dbType = 'meta';
}

MetainfoStore.prototype.add = function(metaObj) {
	if(!metaObj) {
		var def = q.defer();
		def.reject(new Error('Meta object must be supplied.'));
		return def.promise;
	}

	var self = this;
	return this.search(metaObj.name, this.dbType)
		.then(function(hits) {
			var existingMetaObj = hits[0];
			if(existingMetaObj) {
				throw new Error('Meta object already exists.');
			}

			return self.dbClient.add(metaObj, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

MetainfoStore.prototype.getAll = function() {
	return this.dbClient.getAll(this.dbType)
		.then(function(metaObjects) {
			return metaObjects;
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

MetainfoStore.prototype.get = function(metaObjId) {
	return this.dbClient.get(metaObjId, this.dbType)
		.then(function(metaObj) {
			return metaObj || null;
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

MetainfoStore.prototype.update = function(metaObjId, metaObj) {
	var def = q.defer();

	if(!metaObjId || !metaObj) {
		def.reject(new Error('Meta object and meta object ID must be supplied.'));
		return def.promise;
	}

	var self = this;
	return self.dbClient.get(metaObjId, self.dbType)
		.then(function(existingMetaObj) {
			if(!existingMetaObj) {
				throw new Error('Meta object does not exist.');
			}

			return self.dbClient.update(metaObjId, metaObj, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

MetainfoStore.prototype.remove = function(metaObjId) {
	if(!metaObjId) {
		var def = q.defer();
		def.reject(new Error('Meta object ID must be supplied.'));
		return def.promise;
	}

	var self = this;
	return this.dbClient.get(metaObjId, this.dbType)
		.then(function(existingMetaObj) {
			if(!existingMetaObj) {
				throw new Error('Meta object does not exist.');
			}

			return self.dbClient.remove(metaObjId, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

MetainfoStore.prototype.search = function(name) {
	if(!name) {
		var def = q.defer();
		def.reject(new Error('Name must be specified.'));
		return def.promise;
	}

	return this.dbClient.searchField('name', name, this.dbType)
		.then(function(hits) {
			return hits;
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

module.exports = MetainfoStore;