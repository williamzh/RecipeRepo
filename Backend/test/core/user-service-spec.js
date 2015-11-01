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
		var deferredSearch;

		beforeEach(function() {
			sinon.stub(tokenHandler, 'issue').returns('ABCDEFGH');

			deferredSearch = q.defer();
			sinon.stub(dbClient, 'searchFields').returns(deferredSearch.promise);
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
			deferredSearch.resolve([]);

			return userService.authenticate('A', 'password')
				.then(function () {
					throw new Error('Expected authenticate() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Invalid username or password.');
				});
		});

		it('should return error if passwords do not match', function() {
			deferredSearch.resolve([{ userName: 'A', password: 'bar' }]);

			return userService.authenticate('A', 'foo')
				.then(function () {
					throw new Error('Expected authenticate() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Invalid username or password.');
				});
		});

		it('should issue token and return session data otherwise', function() {
			deferredSearch.resolve([{ _id: '5635e61316f396dc17effff3', userName: 'A', password: 'foo' }]);

			return userService.authenticate('A', 'foo')
				.then(function (result) {
					assert(tokenHandler.issue.calledWith(sinon.match({ id: '5635e61316f396dc17effff3' })));
					assert.equal(result.token, 'ABCDEFGH');
				});
		});
	});

	describe('when adding a user', function() {
		var deferredAdd, deferredSearch;

		beforeEach(function() {
			deferredAdd = q.defer();
			sinon.stub(dbClient, 'add').returns(deferredAdd.promise);

			deferredSearch = q.defer();
			sinon.stub(dbClient, 'searchFields').returns(deferredSearch.promise);

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
			deferredSearch.resolve([{ userName: 'A' }])

			return userService.add({ userName: 'A' })
				.then(function () {
					throw new Error('Expected add() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'User already exists.');
				});
		});

		it('should add the user otherwise', function() {
			deferredSearch.resolve([]);
			
			return userService.add({ userName: 'A' })
				.then(function() {
					assert(dbClient.add.calledWith(sinon.match({ userName: 'A' }), 'users'));
				});
		});
	});

	describe('when getting user by ID', function() {
		var deferredGet;

		beforeEach(function() {
			deferredGet = q.defer();

			sinon.stub(dbClient, 'get').returns(deferredGet.promise);
		});

		it('should return null if user does not exist', function() {
			deferredGet.resolve(undefined);

			return userService.get('5635e61316f396dc17effff3')
				.then(function(user) {
					assert.strictEqual(user, null);
				});
		});

		it('should return user if it exists', function() {
			deferredGet.resolve({ _id: '5635e61316f396dc17effff3' });

			return userService.get('5635e61316f396dc17effff3')
				.then(function(user) {
					assert.equal(user._id, '5635e61316f396dc17effff3');
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

		it('should return error if user ID is missing', function() {
			return userService.update(undefined, { userName: 'A' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'User ID and user must be supplied.');
				});
		});

		it('should return error if user is missing', function() {
			return userService.update('5635e61316f396dc17effff3', null)
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'User ID and user must be supplied.');
				});
		});

		it("should return error if user doesn't exist", function() {
			deferredGet.resolve(undefined);

			return userService.update('5635e61316f396dc17effff3', { userName: 'A' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'User does not exist.');
				});
		});

		it('should update the user otherwise', function() {
			deferredGet.resolve({ _id: '5635e61316f396dc17effff3', userName: 'A' });

			return userService.update('5635e61316f396dc17effff3', { id: 'A' });
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

		it('should return error if user ID is missing', function() {
			return userService.remove()
				.then(function(error) {
					throw new Error('Expected remove() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'User ID must be supplied.');
				});
		});

		it("should return error if user doesn't exist", function() {
			deferredGet.resolve(undefined);

			return userService.remove('5635e61316f396dc17effff3')
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'User does not exist.');
				});
		});

		it('should remove the user otherwise', function() {
			deferredGet.resolve({ _id: '5635e61316f396dc17effff3' });

			return userService.remove('5635e61316f396dc17effff3');
		});
	});
});