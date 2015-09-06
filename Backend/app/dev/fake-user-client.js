var q = require('q');
var data = require('./data.json');

function FakeUserClient() { }

FakeUserClient.prototype.create = function(item) {
	var deferred = q.defer();
	//deferred.reject('Create not implemented.');
	deferred.resolve('User created');
	return deferred.promise;
};

FakeUserClient.prototype.get = function(id) {
	var deferred = q.defer();
	deferred.resolve(data.users[id]);
	return deferred.promise;
};

FakeUserClient.prototype.update = function(id, item) {
	var deferred = q.defer();
	deferred.reject('Update not implemented.');
	return deferred.promise;
};

FakeUserClient.prototype.remove = function(id) {
	var deferred = q.defer();
	deferred.reject('Remove not implemented.');
	return deferred.promise;
};

FakeUserClient.prototype.search = function(value) {
	var deferred = q.defer();
	deferred.resolve([data.users[wizha]]);
	return deferred.promise;
};

module.exports = FakeUserClient;