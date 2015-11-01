var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var ConfigManager = require('../config/config-manager');
var q = require('q');
require('sugar');

function DbClient() { }

DbClient.init = function(connectionUrl) {
	var deferred = q.defer();
	var mongoClient = new MongoClient();
	var connectionUrl = connectionUrl || (new ConfigManager()).getConfigValue('dbConnection');
	
	mongoClient.connect(connectionUrl, function(err, db) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			DbClient._db = db;
			deferred.resolve();
		}
	});

	return deferred.promise;
};

DbClient.destroy = function() {
	if(DbClient._db) {
		DbClient._db.close();
		DbClient._db = undefined;
	}
};

DbClient.prototype.add = function(item, type) {
	var deferred = q.defer();

	if(!DbClient._db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	DbClient._db.collection(type).insertOne(item, function(err, result) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

// DbClient.prototype.getAll = function(type) {
// 	var deferred = q.defer();

// 	if(!DbClient._db) {
// 		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
// 		return deferred.promise;
// 	}

// 	DbClient._db.collection(type).find().toArray(function(err, docs) {
// 		if(err) {
// 			deferred.reject(err.message);
// 		}
// 		else {
// 			deferred.resolve(docs);
// 		}		
// 	});

// 	return deferred.promise;
// };

DbClient.prototype.get = function(id, type) {
	var deferred = q.defer();

	if(!DbClient._db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	DbClient._db.collection(type).find({ '_id': ObjectID(id) }).limit(1).next(function(err, doc) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			deferred.resolve(doc);
		}		
	});

	return deferred.promise;
};

DbClient.prototype.update = function(id, item, type) {
	var deferred = q.defer();

	if(!DbClient._db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	DbClient._db.collection(type).updateOne({ '_id': ObjectID(id) }, { $set: item }, function(err, result) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

DbClient.prototype.remove = function(id, type) {
	var deferred = q.defer();

	if(!DbClient._db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	DbClient._db.collection(type).deleteOne({ '_id': ObjectID(id) }, function(err, result) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

DbClient.prototype.searchFields = function(searchParams, type, limit) {
	var deferred = q.defer();

	if(!DbClient._db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	var queryObj = {};
	searchParams.each(function(p) {
		queryObj[p.fieldName] = p.fuzzy === true ? { $regex: p.query } : p.query;
	});

	DbClient._db.collection(type).find(queryObj).limit(limit || 100).toArray(function(err, docs) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			deferred.resolve(docs);
		}
	});

	return deferred.promise;
};

DbClient.prototype.searchText = function(query, type, limit) {
	var deferred = q.defer();

	if(!DbClient._db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	DbClient._db.collection(type).find({ $text: { $search: query } }).limit(limit || 100).toArray(function(err, docs) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			deferred.resolve(docs);
		}
	});

	return deferred.promise;
};

module.exports = DbClient;