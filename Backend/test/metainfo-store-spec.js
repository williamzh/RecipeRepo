var assert = require('assert');
var sinon = require('sinon');
var q = require('q');
var EsClient = require('../es-client');
var IdGenerator = require('../utils/id-generator.js');
var MetainfoStore = require('../metainfo-store');

describe('Provided a MetainfoStore', function() {
	var elasticSearchUrl = 'http://local:9200';
	var esClient, metainfoStore;

	beforeEach(function() {
		esClient = new EsClient('foo');
		idGenerator = new IdGenerator();
		metainfoStore = new MetainfoStore(esClient, idGenerator);
	});

	describe('when adding new meta data', function() {
		var getStub, getDeferred, createStub, createDeferred;

		beforeEach(function() {
			// Mock promise for get()
			getDeferred = q.defer();
			getStub = sinon.stub(esClient, 'get').returns(getDeferred.promise);

			// Mock promise for create()
			createDeferred = q.defer();
			createStub = sinon.stub(esClient, 'create').returns(createDeferred.promise);
		});

		it('should return error if no id is provided', function(done) {
			metainfoStore.addMetaData(undefined, 'foo', undefined, function(error) {
				assert.equal(error, 'Id and value must be provided.');
				done();
			});
		});

		it('should return error if no value is provided', function(done) {
			metainfoStore.addMetaData('key', undefined, undefined, function(error) {
				assert.equal(error, 'Id and value must be provided.');
				done();
			});
		});

		describe('if meta data already exists', function() {
			var existingMetaData = {
				id: 'cuisine',
				values: {
					1: {
						name: 'Swedish'
					},
					2: {
						name: 'Chinese'
					}
				}
			};

			it('should append new value to existing meta data object', function(done) {
				getDeferred.resolve(existingMetaData);

				createDeferred.resolve('Item created');

				var expectedCreateArgs = {
					id: 'cuisine',
					values: {
						1: {
							name: 'Swedish'
						},
						2: {
							name: 'Chinese'
						},
						3: {
							name: 'Italian'
						}
					}
				};

				metainfoStore.addMetaData('cuisine', 'Italian', function(successMsg) {
					assert(createStub.calledWith(expectedCreateArgs, 'cuisine'));
					done();
				});
			});
		});

		describe('if meta data does not exist', function() {
			it('should create new meta data object', function(done) {
				getDeferred.resolve(null);

				createDeferred.resolve('Item created');

				var expectedCreateArgs = {
					id: 'cuisine',
					values: {
						1: {
							name: 'Swedish'
						}
					}
				};

				metainfoStore.addMetaData('cuisine', 'Swedish', function(error) {
					assert(createStub.calledWith(expectedCreateArgs, 'cuisine'));
					done();
				});
			});
		});
	});
});	