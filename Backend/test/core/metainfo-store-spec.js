var assert = require('assert');
var sinon = require('sinon');
var q = require('q');
var MetainfoStore = require('../../app/core/metainfo-store');
var DbClient = require('../../app/data/db-client');

describe('Given a MetainfoStore', function() {
	var metainfoStore, dbClient;

	beforeEach(function() {
		dbClient = new DbClient(null);
		metainfoStore = new MetainfoStore(dbClient);
	});

	describe('when adding a meta object', function() {
		var deferredAdd, deferredGet;

		beforeEach(function() {
			deferredAdd = q.defer();
			sinon.stub(dbClient, 'add').returns(deferredAdd.promise);

			deferredGet = q.defer();
			sinon.stub(dbClient, 'get').returns(deferredGet.promise);

			deferredAdd.resolve();
		});

		it('should return error if no meta object is provided', function() {
			return metainfoStore.add(undefined)
				.then(function () {
					throw new Error('Expected add() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Meta object must be supplied.');
				});
		});

		it('should return error meta object already exists', function() {
			deferredGet.resolve({ id: 'cuisine' })

			return metainfoStore.add({ id: 'cuisine' })
				.then(function () {
					throw new Error('Expected add() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Meta object already exists.');
				});
		});

		it('should add the meta object otherwise', function() {
			deferredGet.resolve(null);
			
			return metainfoStore.add({ id: 'cuisines' })
				.then(function() {
					assert(dbClient.add.calledWith(sinon.match({ id: 'cuisines' }), 'meta'));
				});
		});	
	});

	// describe('when getting all meta objects', function() {
	// 	var deferredGetAll;

	// 	beforeEach(function() {
	// 		deferredGetAll = q.defer();
	// 		sinon.stub(dbClient, 'getAll').returns(deferredGetAll.promise);
	// 	});

	// 	it('should return empty array if no meta objects exist', function() {
	// 		deferredGetAll.resolve([]);

	// 		return metainfoStore.getAll()
	// 			.then(function(result) {
	// 				assert.equal(result.length, 0);
	// 			});
	// 	});

	// 	it('should return all meta objects otherwise', function() {
	// 		deferredGetAll.resolve([{ id: 'cuisines' }, { id: 'categories' }]);

	// 		return metainfoStore.getAll()
	// 			.then(function(result) {
	// 				assert.equal(result.length, 2);
	// 			});
	// 	});
	// });

	describe('when getting a meta object by ID', function() {
		var deferredGet;

		beforeEach(function() {
			deferredGet = q.defer();

			sinon.stub(dbClient, 'get').returns(deferredGet.promise);
		});

		it('should return null if meta object does not exist', function() {
			deferredGet.resolve(undefined);

			return metainfoStore.get('cuisines')
				.then(function(metaObj) {
					assert.strictEqual(metaObj, null);
				});
		});

		it('should return meta object if it exists', function() {
			deferredGet.resolve({ id: 'cuisines' });

			return metainfoStore.get('cuisines')
				.then(function(metaObj) {
					assert.equal(metaObj.id, 'cuisines');
				});
		});
	});

	describe('when updating a meta object', function() {
		var deferredUpdate, deferredGet;

		beforeEach(function() {
			deferredUpdate = q.defer();
			clientStub = sinon.stub(dbClient, 'update').returns(deferredUpdate.promise);

			deferredGet = q.defer();
			sinon.stub(dbClient, 'get').returns(deferredGet.promise);

			deferredUpdate.resolve();
		});

		it('should return error if meta ID is missing', function() {
			return metainfoStore.update(undefined, { id: 'cuisines' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Meta object and meta object ID must be supplied.');
				});
		});

		it('should return error if meta object is missing', function() {
			return metainfoStore.update('cuisines', null)
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Meta object and meta object ID must be supplied.');
				});
		});

		it("should return error if meta IDs don't match", function() {
			return metainfoStore.update('cuisines', { id: 'categories' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Meta object ID mismatch.');
				});
		});

		it("should return error if meta object doesn't exist", function() {
			deferredGet.resolve(undefined);

			return metainfoStore.update('cuisines', { id: 'cuisines' })
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Meta object does not exist.');
				});
		});

		it('should update the meta object otherwise', function() {
			deferredGet.resolve({ id: 'cuisines' });

			return metainfoStore.update('cuisines', { id: 'cuisines' });
		});
	});
	
	describe('when removing a meta object', function() {
		var deferredRemove, deferredGet;

		beforeEach(function() {
			deferredRemove = q.defer();
			clientStub = sinon.stub(dbClient, 'remove').returns(deferredRemove.promise);

			deferredGet = q.defer();
			sinon.stub(dbClient, 'get').returns(deferredGet.promise);

			deferredRemove.resolve();
		});

		it('should return error if meta object ID is missing', function() {
			return metainfoStore.remove()
				.then(function(error) {
					throw new Error('Expected remove() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Meta object ID must be supplied.');
				});
		});

		it("should return error if metaObj doesn't exist", function() {
			deferredGet.resolve(undefined);

			return metainfoStore.remove('cuisines')
				.then(function(error) {
					throw new Error('Expected update() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Meta object does not exist.');
				});
		});

		it('should remove the meta object otherwise', function() {
			deferredGet.resolve({ id: 'cuisines' });

			return metainfoStore.remove('cuisines');
		});
	});
});