var assert = require('assert');
var sinon = require('sinon');
var q = require('q');
var EsClient = require('../es-client');
var MetainfoStore = require('../metainfo-store');

describe('Provided a MetainfoStore', function() {
	var elasticSearchUrl = 'http://local:9200';
	var deferred, esClient, metainfoStore;

	beforeEach(function() {
		deferred = q.defer();
		esClient = new EsClient('foo');
		metainfoStore = new MetainfoStore(esClient);
	});

	describe('when adding a metainfo key', function() {
		var createStub, createDeffered;

		beforeEach(function() {
			sinon.stub(esClient, 'get').returns(deferred.promise);

			createDeffered = q.defer();
			createStub = sinon.stub(esClient, 'create').returns(createDeffered.promise);
		});

		it('should return error if no key is provided', function(done) {
			metainfoStore.addKey(undefined, undefined, function(error) {
				assert.equal(error, 'Key must be supplied.');
				done();
			});
		});

		it('should add key if no previous keys exist', function(done) {
			deferred.resolve(undefined);
			createDeffered.resolve('Item created');

			metainfoStore.addKey('newKey', function(error) {
				sinon.assert.calledWith(createStub, { keys: ['newKey'] });
				done();
			});
		});

		it('should append key if previous keys exist', function(done) {
			deferred.resolve({ keys: ['oldKey1', 'oldKey2'] });
			createDeffered.resolve('Item created');

			metainfoStore.addKey('newKey', function(error) {
				sinon.assert.calledWith(createStub, { keys: ['oldKey1', 'oldKey2', 'newKey'] });
				done();
			});
		});
	});
});	