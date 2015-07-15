var FakeMetaClient = require('../dev/fake-meta-client');
var q = require('q');

function MetainfoStore(client) {
	this.client = client || new FakeMetaClient();
}

MetainfoStore.prototype.add = function(type, name) {
	if(!type || !name) {
		var def = q.defer();
		def.reject('Type and name be supplied.');
		return def.promise;
	}

	return this.client.create(type, name).then(function(successMsg) {
		// TODO: log
		return successMsg;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

MetainfoStore.prototype.getAll = function() {
	return this.client.getAll().then(function(items) {
		// TODO: log
		return items;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

MetainfoStore.prototype.get = function(type, id) {
	return this.client.get(type, id).then(function(item) {
		// TODO: log
		return item;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

MetainfoStore.prototype.update = function(type, id, name) {
	var def = q.defer();

	if(!type || !id || !name) {
		def.reject('Type, ID and name must be supplied');
		return def.promise;
	}

	return this.client.update(type, id, name).then(function(successMsg) {
		// TODO: log
		return successMsg;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

MetainfoStore.prototype.remove = function(type, id) {
	if(!type || !id) {
		var def = q.defer();
		def.reject('Type and ID must be supplied');
		return def.promise;
	}

	return this.client.remove(type, id).then(function(successMsg) {
		// TODO: log
		return successMsg;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

module.exports = MetainfoStore;