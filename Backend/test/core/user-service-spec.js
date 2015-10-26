var assert = require('assert');
var sinon = require('sinon');
var q = require('q');
var UserService = require('../../app/core/user-service');
var DbClient = require('../../app/data/db-client');
var TokenHandler = require('../../app/core/auth/token-handler');

describe('Given a UserService', function() {
	var userService, dbClient, tokenHandler;

	beforeEach(function() {
		dbClient = new DbClient(null);
		tokenHandler = new TokenHandler();

		userService = new UserService(dbClient, tokenHandler);
	});

	describe('when authenticating a user', function() {
		var deferredGet;

		beforeEach(function() {
			sinon.stub(tokenHandler, 'issue').returns('ABCDEFGH');

			deferredGet = q.defer();
			sinon.stub(dbClient, 'get').returns(deferredGet.promise);
		});

		it('should return error if no username provided', function() {
			return userService.authenticate(undefined, 'passw0rd')
				.then(function () {
					throw new Error('Expected authenticate() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Username and password must be provided.');
				});
		});

		it('should return error if no password provided', function() {
			return userService.authenticate('A', undefined)
				.then(function () {
					throw new Error('Expected authenticate() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Username and password must be provided.');
				});
		});

		it('should return error if user with provided username does not exist', function() {
			deferredGet.resolve(undefined);

			return userService.authenticate('A', 'password')
				.then(function () {
					throw new Error('Expected authenticate() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Invalid username or password.');
				});
		});

		it('should return error if passwords do not match', function() {
			deferredGet.resolve({ id: 'A', password: 'bar' });

			return userService.authenticate('A', 'foo')
				.then(function () {
					throw new Error('Expected authenticate() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Invalid username or password.');
				});
		});

		it('should issue token and return session data otherwise', function() {
			deferredGet.resolve({ id: 'A', password: 'foo' });

			return userService.authenticate('A', 'foo')
				.then(function (result) {
					assert(tokenHandler.issue.calledWith(sinon.match({ id: 'A' })));
					assert.equal(result.token, 'ABCDEFGH');
				});
		});
	});

	describe('when adding a user', function() {
		var deferredAdd, deferredGet;

		beforeEach(function() {
			deferredAdd = q.defer();
			sinon.stub(dbClient, 'add').returns(deferredAdd.promise);

			deferredGet = q.defer();
			sinon.stub(dbClient, 'get').returns(deferredGet.promise);

			deferredAdd.resolve();
		});

		it('should return error if no user is provided', function() {
			return userService.add(undefined)
				.then(function () {
					throw new Error('Expected add() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'User must be supplied.');
				});
		});

		it('should return error user already exists', function() {
			deferredGet.resolve({ id: 'A' })

			return userService.add({ id: 'A' })
				.then(function () {
					throw new Error('Expected add() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'User already exists.');
				});
		});

		it('should add the user otherwise', function() {
			deferredGet.resolve(null);
			
			return userService.add({ id: 'A' })
				.then(function() {
					assert(dbClient.add.calledWith(sinon.match({ id: 'A' }), 'users'));
				});
		});
	});

	describe('when getting user by user name', function() {
		var deferredGet;

		beforeEach(function() {
			deferredGet = q.defer();

			sinon.stub(dbClient, 'get').returns(deferredGet.promise);
		});

		it('should return null if user does not exist', function() {
			deferredGet.resolve(undefined);

			return userService.get('A')
				.then(function(user) {
					assert.strictEqual(user, null);
				});
		});

		it('should return user if it exists', function() {
			deferredGet.resolve({ id: 'A' });

			return userService.get('1')
				.then(function(user) {
					assert.equal(user.id, 'A');
				});
		});
	});

	describe('when updating a user', function() {
		var deferredUpdate, deferredGet;

		beforeEach(function() {
			deferredUpdate = q.defer();
			clientStub = sinon.stub(dbClient, 'update').returns(deferredUpdate.promise);

			deferredGet = q.defer();
			sinon.stub(dbClient, 'get').returns(deferredGet.promise);

			deferredUpdate.resolve();
		});

		it('should return error if username is missing', function() {
			return userService.update(undefined, { id: 'A' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Username and user must be supplied.');
				});
		});

		it('should return error if user is missing', function() {
			return userService.update('A', null)
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Username and user must be supplied.');
				});
		});

		it("should return error if usernames don't match", function() {
			return userService.update('A', { id: 'B' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Username mismatch.');
				});
		});

		it("should return error if user doesn't exist", function() {
			deferredGet.resolve(undefined);

			return userService.update('A', { id: 'A' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'User does not exist.');
				});
		});

		it('should update the user otherwise', function() {
			deferredGet.resolve({ id: 'A' });

			return userService.update('A', { id: 'A' });
		});
	});
	
	describe('when removing a user', function() {
		var deferredRemove, deferredGet;

		beforeEach(function() {
			deferredRemove = q.defer();
			clientStub = sinon.stub(dbClient, 'remove').returns(deferredRemove.promise);

			deferredGet = q.defer();
			sinon.stub(dbClient, 'get').returns(deferredGet.promise);

			deferredRemove.resolve();
		});

		it('should return error if user name is missing', function() {
			return userService.remove()
				.then(function(error) {
					throw new Error('Expected remove() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Username must be supplied.');
				});
		});

		it("should return error if user doesn't exist", function() {
			deferredGet.resolve(undefined);

			return userService.remove('A')
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'User does not exist.');
				});
		});

		it('should remove the user otherwise', function() {
			deferredGet.resolve({ id: 'A' });

			return userService.remove('A');
		});
	});
});