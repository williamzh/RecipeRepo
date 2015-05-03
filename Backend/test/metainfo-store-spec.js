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

	describe('when setting meta data', function() {
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
			metainfoStore.setMetaData(undefined, 'foo', undefined, function(result) {
				assert.deepEqual(result, 'Id and value must be provided.');
				done();
			});
		});

		it('should return error if no value is provided', function(done) {
			metainfoStore.setMetaData('key', undefined, undefined, function(result) {
				assert.deepEqual(result, 'Id and value must be provided.');
				done();
			});
		});

		describe('if value is not camel cased', function() {
			beforeEach(function() {
				// Simulate non-existent meta data
				getDeferred.resolve(null);
				createDeferred.resolve('Item created');
			});

			it('should camel case values with special characters', function(done) {
				var expectedCreateArgs = {
					id: 'cuisine',
					values: ['gratinsPies']
				};

				metainfoStore.setMetaData('cuisine', 'Gratins, pies', function(error) {
					assert(createStub.calledWith(expectedCreateArgs, 'cuisine'));
					done();
				});
			});
		});


		describe('if meta data already exists', function() {
			var existingMetaData = {
				id: 'cuisine',
				values: ['swedish', 'chinese']
			};

			beforeEach(function() {
				getDeferred.resolve(existingMetaData);
			});

			it('should not do anything if same value exists', function(done) {
				metainfoStore.setMetaData('cuisine', 'swedish', function(result) {
					assert(!createStub.called);
					done();
				});
			});

			it('should append new value if same value doesn\'t exist', function(done) {
				createDeferred.resolve('Item created');

				var expectedCreateArgs = {
					id: 'cuisine',
					values: ['swedish', 'chinese', 'italian']
				};

				metainfoStore.setMetaData('cuisine', 'italian', function(result) {
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
					values: ['swedish']
				};

				metainfoStore.setMetaData('cuisine', 'swedish', function(error) {
					assert(createStub.calledWith(expectedCreateArgs, 'cuisine'));
					done();
				});
			});
		});
	});
});	