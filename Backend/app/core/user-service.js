//var FakeUserClient = require('../dev/fake-user-client');
var DbClient = require('../data/db-client');
var q = require('q');
require('sugar');
var TokenHandler = require('./auth/token-handler');

function UserService(dbClient, tokenHandler) {
	this.dbType = 'users';

	this.dbClient = dbClient || new DbClient();
	this.tokenHandler = tokenHandler || new TokenHandler();
}

UserService.prototype.authenticate = function(userName, password) {
	if(!userName || !password) {
		var def = q.defer();
		def.reject(new Error('Username and password must be provided.'));
		return def.promise;	
	}
	
	var self = this;
	return this.dbClient.get(userName, this.dbType)
		.then(function(user) {
			if(!user || user.password !== password) {
				throw new Error('Invalid username or password.');
			}

			var token = self.tokenHandler.issue({ id: user.id });
			return {
				user: user,
				token: token
			};
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

UserService.prototype.add = function(user) {
	if(!user) {
		var def = q.defer();
		def.reject(new Error('User must be supplied.'));
		return def.promise;
	}

	var self = this;
	return self.dbClient.get(user.id, self.dbType)
		.then(function(existingUser) {
			if(existingUser) {
				throw new Error('User already exists.');
			}

			return self.dbClient.add(user, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

UserService.prototype.get = function(userName) {
	if(!userName) {
		var def = q.defer();
		def.reject(new Error('Username must be supplied.'));
		return def.promise;
	}

	return this.dbClient.get(userName, this.dbType)
		.then(function(user) {
			return user || null;
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

UserService.prototype.update = function(userName, user) {
	var def = q.defer();

	if(!userName || !user) {
		def.reject(new Error('Username and user must be supplied.'));
		return def.promise;
	}

	if(userName !== user.id) {
		def.reject(new Error('Username mismatch.'));
		return def.promise;
	}

	var self = this;
	return self.dbClient.get(userName, self.dbType)
		.then(function(existingUser) {
			if(!existingUser) {
				throw new Error('User does not exist.');
			}

			return self.dbClient.update(userName, user, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

UserService.prototype.remove = function(userName) {
	if(!userName) {
		var def = q.defer();
		def.reject(new Error('Username must be supplied.'));
		return def.promise;
	}

	var self = this;
	return self.dbClient.get(userName, self.dbType)
		.then(function(existingUser) {
			if(!existingUser) {
				throw new Error('User does not exist.');
			}

			return self.dbClient.remove(userName, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

UserService.prototype.search = function(query) {
	if(!query) {
		var def = q.defer();
		def.reject(new Error('Query must be specified.'));
		return def.promise;
	}

	return this.dbClient.search(query, this.dbType)
		.then(function(hits) {
			return hits;
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

module.exports = UserService;