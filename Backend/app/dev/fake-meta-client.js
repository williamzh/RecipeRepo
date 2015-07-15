var q = require('q');
var data = require('./data.json');

function FakeMetaClient() { }

FakeMetaClient.prototype.create = function(type, name) {
	var deferred = q.defer();
	deferred.reject('Create not implemented.');
	return deferred.promise;
};

FakeMetaClient.prototype.getAll = function() {
	var metaObj = data.meta;
	
	var deferred = q.defer();
	deferred.resolve(metaObj);
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