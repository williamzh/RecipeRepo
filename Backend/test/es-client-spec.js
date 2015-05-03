var assert = require('assert');
var sinon = require('sinon');
var nock = require('nock');
var ConfigManager = require('../config-manager');
var IdGenerator = require('../utils/id-generator');
var EsClient = require('../es-client');

describe('Provided an EsClient', function() {
	var esClient, esUrl, idGenerator;

	before(function() {
		esUrl = 'http://local:9200';
		nock.disableNetConnect();
	});

	beforeEach(function() {
		var configManager = new ConfigManager();
		sinon.stub(configManager, 'getConfigValue').returns('local');

		idGenerator = new IdGenerator();

		esClient = new EsClient('foo', configManager, idGenerator);	
	});

	afterEach(function() {
		nock.cleanAll();
	});

	describe('when creating an item', function() {
		it('should return error if HTTP error is returned', function(done) {
			nock(esUrl)
				.post('/reciperepo/foo/1')
				.reply(500);

			esClient.get(1).then(function() {}, function(error) {
				assert(error);
				done();
			});
		});

		it('should not attempt to auto-generate ID if ID is provided', function(done) {
			nock(esUrl)
				.post('/reciperepo/foo/1')
				.reply(200);

			sinon.spy(idGenerator, 'generateId');

			esClient.create({}, '1').then(function(successMsg) {
				assert(!idGenerator.generateId.called);
				done();
			});
		});

		it('should attempt to auto-generate ID if ID is not provided', function(done) {
			nock(esUrl)
				.post('/reciperepo/foo/2')
				.reply(200);

			nock(esUrl)
				.get('/reciperepo/foo/_search')
				.reply(200, {
					"hits": {
						"hits": [
							{ "_id": 1 }
						]
					}
				});

			var idSpy = sinon.spy(idGenerator, 'generateId');

			esClient.create({}).then(function(successMsg) {
				assert(idSpy.calledWith([1]));
				done();
			});
		});

		it('should create the recipe otherwise', function(done) {
			var expectedPost = nock(esUrl)
				.post('/reciperepo/foo/5')
				.reply(200);

			esClient.create({}, '5').then(function(successMsg) {
				assert(expectedPost.isDone());
				done();
			});
		});
	});

	describe('when getting all items', function() {
		it('should return error if HTTP error is returned', function(done) {
			nock(esUrl)
				.get('/reciperepo/foo/_search')
				.reply(500);

			esClient.get(1).then(function() {}, function(error) {
				assert(error);
				done();
			});
		});

		it('should retrieve and remap items', function(done) {
			nock(esUrl)
				.get('/reciperepo/foo/_search')
				.reply(200, {
					"hits": {
						"hits": [
							{ "_source": { "id": 1 } },
							{ "_source": { "id": 2 } }
						]
					}
				});

			esClient.getAll().then(function(items) {
				assert.equal(items[0].id, 1);
				assert.equal(items[1].id, 2);
				done();
			});
		});
	});

	describe('when getting a specific item', function() {
		it('should return error if HTTP error is returned', function(done) {
			nock(esUrl)
				.get('/reciperepo/foo/1')
				.reply(500);

			esClient.get(1).then(function() {}, function(error) {
				assert(error);
				done();
			});
		});

		it('should return null if no matching item found', function(done) {
			nock(esUrl)
				.get('/reciperepo/foo/1')
				.reply(404);

			esClient.get(1).then(function(item) {
				assert.equal(item, null);
				done();
			});
		});

		it('should return recipe otherwise', function(done) {
			nock(esUrl)
				.get('/reciperepo/foo/1')
				.reply(200, {
					"_source": {
						"id": 1
					}
				});

			esClient.get(1).then(function(item) {
				assert.equal(item.id, 1);
				done();
			});
		});
	});

	describe('when updating a recipe', function() {
		it('should return error if recipe doesn\'t exist', function(done) {
			nock(esUrl)
				.get('/reciperepo/foo/1')
				.reply(404);

			esClient.update(1, {}).then(function() {}, function(error) {
				assert.equal(error, 'Failed to update item with ID 1, because it does not exist.');
				done();
			});
		});

		it('should update the recipe otherwise', function(done) {
			nock(esUrl)
				.get('/reciperepo/foo/1')
				.reply(200, {
					"_source": {
						"id": 1
					}
				});

			var expectedPut = nock(esUrl)
				.put('/reciperepo/foo/1')
				.reply(200, {});

			esClient.update(1, {}).then(function(successMsg) {
				assert(expectedPut.isDone());
				done();
			});
		});
	});

	describe('when deleting a recipe', function() {
		it('should return error if recipe doesn\'t exist', function(done) {
			nock(esUrl)
				.get('/reciperepo/foo/1')
				.reply(404);

			esClient.remove(1, {}).then(function() {}, function(error) {
				assert.equal(error, 'Failed to remove item with ID 1, because it does not exist.');
				done();
			});
		});

		it('should remove the recipe otherwise', function(done) {
			nock(esUrl)
				.get('/reciperepo/foo/1')
				.reply(200, {
					"_source": {
						"id": 1
					}
				});

			var expectedDelete = nock(esUrl)
				.delete('/reciperepo/foo/1')
				.reply(200);

			esClient.remove(1, {}).then(function(successMsg) {
				assert(expectedDelete.isDone());
				done();
			});
		});
	});
});