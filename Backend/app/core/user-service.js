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
	return this.search(userName)
		.then(function(hits) {
			var user = hits[0];
			if(!user || user.password !== password) {
				throw new Error('Invalid username or password.');
			}

			var token = self.tokenHandler.issue({ id: user._id });
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
	return this.search(user.userName)
		.then(function(hits) {
			var existingUser = hits[0];
			if(existingUser) {
				throw new Error('User already exists.');
			}

			return self.dbClient.add(user, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

UserService.prototype.get = function(userId) {
	if(!userId) {
		var def = q.defer();
		def.reject(new Error('User ID must be supplied.'));
		return def.promise;
	}

	return this.dbClient.get(userId, this.dbType)
		.then(function(user) {
			return user || null;
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

UserService.prototype.update = function(userId, user) {
	var def = q.defer();

	if(!userId || !user) {
		def.reject(new Error('User ID and user must be supplied.'));
		return def.promise;
	}

	var self = this;
	return self.dbClient.get(userId, self.dbType)
		.then(function(existingUser) {
			if(!existingUser) {
				throw new Error('User does not exist.');
			}

			return self.dbClient.update(userId, user, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

UserService.prototype.remove = function(userId) {
	if(!userId) {
		var def = q.defer();
		def.reject(new Error('User ID must be supplied.'));
		return def.promise;
	}

	var self = this;
	return self.dbClient.get(userId, self.dbType)
		.then(function(existingUser) {
			if(!existingUser) {
				throw new Error('User does not exist.');
			}

			return self.dbClient.remove(userId, self.dbType);
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

UserService.prototype.search = function(userName) {
	if(!userName) {
		var def = q.defer();
		def.reject(new Error('Username must be specified.'));
		return def.promise;
	}

	return this.dbClient.searchFields([
		{ fieldName: 'userName', query: userName, fuzzy: false }
	], this.dbType)
		.then(function(hits) {
			return hits;
		})
		.catch(function(error) {
			return q.reject(error);
		});
};

module.exports = UserService;