var q = require('q');
var data = require('./data.json');

function FakeMetaClient() { }

FakeMetaClient.prototype.create = function(type, name) {
	var deferred = q.defer();
	deferred.reject('Create not implemented.');
	return deferred.promise;
};

FakeMetaClient.prototype.getAll = function(type) {
	var metaObj = data.meta[type];
	var metaArray = Object.keys(metaObj).map(function(typeKey) {
		return metaObj[typeKey];
	});

	var deferred = q.defer();
	deferred.resolve(metaArray);
	return deferred.promise;
};

FakeMetaClient.prototype.get = function(type, id) {
	var metaObj = data.meta[type];

	var deferred = q.defer();
	deferred.resolve(metaObj[id]);
	return deferred.promise;
};

FakeMetaClient.prototype.update = function(type, id) {
	var deferred = q.defer();
	deferred.reject('Update not implemented.');
	return deferred.promise;
};

FakeMetaClient.prototype.remove = function(type, id) {
	var deferred = q.defer();
	deferred.reject('Remove not implemented.');
	return deferred.promise;
};

module.exports = FakeMetaClient;