var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var sinon = require('sinon');
var ConfigManager = require('../../app/config/config-manager');
var DbClient = require('../../app/data/db-client');
var data = require('./data.json');

var conenctionUrl = 'mongodb://localhost:27017/integration_test';

describe('Given a dbClient', function() {
	var dbClient, testDb;

	before(function() {
		var configManager = new ConfigManager();
		sinon.stub(configManager, 'getConfigValue').returns(conenctionUrl);

		dbClient = new DbClient(configManager);
	});

	it('should be able to establish and close a connection', function() {
		return dbClient.init()
			.then(function() {
				dbClient.destroy();
			});
	});

	describe('with a valid connection', function() {
		before(function() {
			// Initialize test DB connection
			return MongoClient.connect(conenctionUrl)
				.then(function(db) {
					testDb = db;
					// Initialize DB client
					return dbClient.init();
				});
		});

		after(function() {
			testDb.close();
			dbClient.destroy();
		});

		describe('when performing basic CRUD operations', function() {
			afterEach(function() {
				return testDb.collection('testCollection').deleteMany({});
			});

			describe('Create', function() {
				it('should be able to insert an item', function() {
					return dbClient.add({ id: 1 }, 'testCollection')
						.then(function() {
							return testDb.collection('testCollection').find({ id: 1 }).limit(1).next();
						})
						.then(function(doc) {
					   		assert.equal(doc.id, 1);
						});
				});	
			});	
			

			describe('Read', function() {
				it('should return empty array if no items exist', function() {
					return dbClient.getAll('testCollection')
						.then(function(items) {
							assert.equal(items.length, 0);
						});
				});

				it('should be able to get all items', function() {
					return testDb.collection('testCollection').insertMany([{ id: 1 }, { id: 2 }])
						.then(function(result) {
							return dbClient.getAll('testCollection');
						})
						.then(function(items) {
							assert.equal(items.length, 2);
						});
				});

				it('should return undefined if no item with matching ID', function() {
					return dbClient.get(2, 'testCollection')
						.then(function(item) {
							assert.strictEqual(item, undefined);
						});
				});

				it('should be able to get an item by ID', function() {
					return testDb.collection('testCollection').insertMany([{ id: 1 }, { id: 2 }])
						.then(function(result) {
							return dbClient.get(2, 'testCollection')
						})
						.then(function(item) {
							assert.equal(item.id, 2);
						});
				});
			});

			describe('Update', function() {
				it('should be able to update an item', function() {
					return testDb.collection('testCollection').insertMany([{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }])
						.then(function(result) {
							return dbClient.update(1, { id: 1, name: 'fu' }, 'testCollection');
						})
						.then(function() {
							return testDb.collection('testCollection').find({ id: 1 }).limit(1).next();
						})
						.then(function(doc) {
					   		assert.equal(doc.name, 'fu');
						});
				});
			});

			describe('Delete', function() {
				it('should be able to remove an item', function() {
					return testDb.collection('testCollection').insertOne({ id: 1, name: 'foo' })
						.then(function(result) {
							return dbClient.remove(1, 'testCollection');
						})
						.then(function() {
							return testDb.collection('testCollection').find({ id: 1 }).limit(1).next();
						})
						.then(function(doc) {
					   		assert(!doc);
						});
				});
			});
		});

		describe('when performing a free text search', function() {
			before(function() {
				var recipes = data.recipes;

				return testDb.collection('testCollection').insertMany(recipes)
					.then(function(result) {
						// Create indices for relevant fields
						return testDb.collection('testCollection').createIndex({ 
							recipeName: 'text', 
							description: 'text',
							'ingredients.name': 'text'
						}, { 
							name: 'testSearchIndex' 
						});
					})
					.then(function(indexName) { 
						assert.equal(indexName, 'testSearchIndex');
					});
			});

			after(function() {
				return testDb.collection('testCollection').dropIndex('testSearchIndex')
					.then(function() {
						return testDb.collection('testCollection').deleteMany({});
					});
			});

			it('should be able to find items based on a single field', function() {
				return dbClient.search('pannbiff', 'testCollection')
					.then(function(items) {
						assert.equal(items.length, 1);
						assert.equal(items[0].id, '6');
					});
			});

			it('should be able to find an item based on multiple fields', function() {
				return dbClient.search('champinjonsås', 'testCollection')
					.then(function(items) {
						assert.equal(items.length, 2);
						assert.equal(items[0].id, '8');
						assert.equal(items[1].id, '12');
					});
			});

			it('should be able to find items based on nested fields', function() {
				return dbClient.search('mustig kantarell', 'testCollection')
					.then(function(items) {
						assert.equal(items.length, 1);
						assert.equal(items[0].id, '5');
					});
			});
		});
	});
});