var q = require('q');
var data = require('./data.json');

function FakeRecipeClient() { }

FakeRecipeClient.prototype.create = function(item) {
	var deferred = q.defer();
	deferred.reject('Create not implemented.');
	return deferred.promise;
};

FakeRecipeClient.prototype.getAll = function() {
	var deferred = q.defer();
	deferred.resolve(data.recipes);
	return deferred.promise;
};

FakeRecipeClient.prototype.get = function(id) {
	var deferred = q.defer();
	deferred.resolve(data.recipes.find(function(r) { return r.id == id }));
	return deferred.promise;
};

FakeRecipeClient.prototype.update = function(id, item) {
	var deferred = q.defer();
	deferred.reject('Update not implemented.');
	return deferred.promise;
};

FakeRecipeClient.prototype.remove = function(id) {
	var deferred = q.defer();
	deferred.reject('Remove not implemented.');
	return deferred.promise;
};

FakeRecipeClient.prototype.search = function(query) {
	// Crude search based on recipe name only
	var hits = data.recipes.find(function(r) {
		return r.name.indexOf(query) > -1;
	});

	var deferred = q.defer();
	deferred.resolve(hits);
	return deferred.promise;
};

module.exports = FakeRecipeClient;