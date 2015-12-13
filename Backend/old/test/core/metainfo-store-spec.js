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
		var deferredAdd, deferredSearch;

		beforeEach(function() {
			deferredAdd = q.defer();
			sinon.stub(dbClient, 'add').returns(deferredAdd.promise);

			deferredSearch = q.defer();
			sinon.stub(dbClient, 'searchField').returns(deferredSearch.promise);

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

		it('should return error if meta object already exists', function() {
			deferredSearch.resolve([{ name: 'cuisine' }])

			return metainfoStore.add({ name: 'cuisine' })
				.then(function () {
					throw new Error('Expected add() to fail');
				})
				.catch(function(err) {
					assert.equal(err.message, 'Meta object already exists.');
				});
		});

		it('should add the meta object otherwise', function() {
			deferredSearch.resolve([]);
			
			return metainfoStore.add({ name: 'cuisines' })
				.then(function() {
					assert(dbClient.add.calledWith(sinon.match({ name: 'cuisines' }), 'meta'));
				});
		});	
	});

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