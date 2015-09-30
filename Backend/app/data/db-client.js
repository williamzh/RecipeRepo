var MongoClient = require('mongodb').MongoClient;
var q = require('q');

function DbClient(configManager) {
	this.mongoClient = new MongoClient();
	this.configManager = configManager || new ConfigManager();
	this.connectionUrl = configManager.getConfigValue('dbConnection');
}

DbClient.prototype.add = function(item, type) {
	var deferred = q.defer();
	
	this._open()
		.then(function(db) {
			db.collection(type).insertOne(item, function(err, result) {
				if(err) {
					deferred.reject(err);
				}
				else {
					deferred.resolve();
				}

				db.close();
			});
		})
		.catch(function(err) {
			deferred.reject(err);
		});

	return deferred.promise;
};

DbClient.prototype.getAll = function(type) {
	var deferred = q.defer();

	this._open()
		.then(function(db) {
			db.collection(type).find().toArray(function(err, docs) {
				if(err) {
					deferred.reject(err);
				}
				else {
					deferred.resolve(docs);
				}

				db.close();				
			});
		})
		.catch(function() {
			deferred.reject(err);
		});

	return deferred.promise;
};

DbClient.prototype.get = function(id, type) {
	var deferred = q.defer();

	this._open()
		.then(function(db) {
			db.collection(type).find({ 'id': id }).limit(1).toArray(function(err, docs) {
				if(err) {
					deferred.reject(err);
				}
				else {
					deferred.resolve(docs[0]);
				}

				db.close();				
			});
		})
		.catch(function() {
			deferred.reject(err);
		});

	return deferred.promise;
};

DbClient.prototype.update = function(id, item, type) {
	var deferred = q.defer();

	this._open()
		.then(function(db) {
			db.collection(type).updateOne({ 'id': id }, { $set: item }, function(err, result) {
				if(err) {
					deferred.reject(err);
				}
				else {
					deferred.resolve();
				}

				db.close();				
			});
		})
		.catch(function() {
			deferred.reject(err);
		});

	return deferred.promise;
};

DbClient.prototype.remove = function(id, type) {
	var deferred = q.defer();

	this._open()
		.then(function(db) {
			db.collection(type).deleteOne({ 'id': id }, function(err, result) {
				if(err) {
					deferred.reject(err);
				}
				else {
					deferred.resolve();
				}

				db.close();				
			});
		})
		.catch(function() {
			deferred.reject(err);
		});

	return deferred.promise;
};

DbClient.prototype.search = function(query, type) {
	// TODO: implement free text search
};


DbClient.prototype._open = function() {
	var deferred = q.defer();
	this.mongoClient.connect(this.connectionUrl, function(err, db) {
		if(err) {
			deferred.reject(err);
		}
		else {
			deferred.resolve(db);
		}
	});

	return deferred.promise;
};

module.exports = DbClient;