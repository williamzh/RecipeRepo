var MongoClient = require('mongodb').MongoClient;
var ConfigManager = require('../config/config-manager');
var q = require('q');

function DbClient(configManager) {
	this.configManager = configManager || new ConfigManager();
	this.connectionUrl = this.configManager.getConfigValue('dbConnection');
	this.db = null;
}

DbClient.prototype.init = function() {
	var deferred = q.defer();
	var mongoClient = new MongoClient();
	var self = this;
	
	mongoClient.connect(this.connectionUrl, function(err, db) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			self.db = db;
			deferred.resolve();
		}
	});

	return deferred.promise;
};

DbClient.prototype.destroy = function() {
	if(this.db) {
		this.db.close();
	}
};

DbClient.prototype.add = function(item, type) {
	var deferred = q.defer();

	if(!this.db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	this.db.collection(type).insertOne(item, function(err, result) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

DbClient.prototype.getAll = function(type) {
	var deferred = q.defer();

	if(!this.db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	this.db.collection(type).find().toArray(function(err, docs) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			deferred.resolve(docs);
		}		
	});

	return deferred.promise;
};

DbClient.prototype.get = function(id, type) {
	var deferred = q.defer();

	if(!this.db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	this.db.collection(type).find({ 'id': id }).limit(1).toArray(function(err, docs) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			deferred.resolve(docs[0]);
		}		
	});

	return deferred.promise;
};

DbClient.prototype.update = function(id, item, type) {
	var deferred = q.defer();

	if(!this.db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	this.db.collection(type).updateOne({ 'id': id }, { $set: item }, function(err, result) {
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

	if(!this.db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	this.db.collection(type).deleteOne({ 'id': id }, function(err, result) {
		if(err) {
			deferred.reject(err.message);
		}
		else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

DbClient.prototype.search = function(query, type, limit) {
	var deferred = q.defer();

	if(!this.db) {
		deferred.reject('No connection has been configured. Call init() during startup to configure one.');
		return deferred.promise;
	}

	this.db.collection(type).find({ $text: { $search: query } }).limit(limit || 50).toArray(function(err, docs) {
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