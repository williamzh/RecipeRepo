var FakeUserClient = require('../../dev/fake-user-client');
var q = require('q');
require('sugar');
var jwt = require('jsonwebtoken'); 

function UserService(client) {
	this.client = client || new FakeUserClient();
}

UserService.prototype.authenticate = function(userName, password) {
	var def = q.defer();

	this.client.get(userName).then(function(user) {
		var isSuccess = user && user.password === password;
		if(isSuccess) {
			var token = jwt.sign(userName, 'secret', {
				expiresInMinutes: 60
			});
			user.userName = userName;
			def.resolve({
				user: user,
				token: token
			});
		}
		else {
			def.reject('Invalid username or password.');
		}
	})
	.catch(function() {
		// TODO: log
		def.reject('Authentication failed.');
	});

	return def.promise;
};

UserService.prototype.add = function(user) {
	if(!user) {
		var def = q.defer();
		def.reject('User must be supplied.');
		return def.promise;
	}

	return this.client.create(user).then(function(successMsg) {
		// TODO: log
		return successMsg;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

UserService.prototype.get = function(userName) {
	return this.client.get(userName).then(function(user) {
		// TODO: log
		return user;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

UserService.prototype.update = function(userName, user) {
	var def = q.defer();

	if(!userName) {
		def.reject('Username must be supplied');
		return def.promise;
	}

	if(!user) {
		def.reject('User must be supplied');
		return def.promise;
	}

	return this.client.update(userName, user).then(function(successMsg) {
		// TODO: log
		return successMsg;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

UserService.prototype.remove = function(userName) {
	if(!userName) {
		var def = q.defer();
		def.reject('Username must be supplied');
		return def.promise;
	}

	return this.client.remove(userName).then(function(successMsg) {
		// TODO: log
		return successMsg;
	})
	.catch(function(errorMsg) {
		return errorMsg;
	});
};

module.exports = UserService;