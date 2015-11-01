var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var sinon = require('sinon');
var DbClient = require('../../app/data/db-client');
var data = require('./data.json');

describe('Given a dbClient', function() {
	var dbClient, testDb;
	var conenctionUrl = 'mongodb://localhost:27017/integration_test';

	before(function() {
		dbClient = new DbClient();
	});

	it('should be able to establish and close a connection', function() {
		return DbClient.init(conenctionUrl)
			.then(function() {
				DbClient.destroy();
				assert.equal(DbClient._db, undefined);
			});
	});

	describe('with a valid connection', function() {
		before(function() {
			return DbClient.init(conenctionUrl)
				.then(function() {
					testDb = DbClient._db;
				});
		});

		after(function() {
			DbClient.destroy();
		});

		describe('when performing basic CRUD operations', function() {
			afterEach(function() {
				return testDb.collection('testCollection').deleteMany({});
			});

			describe('Create', function() {
				it('should be able to insert an item', function() {
					return dbClient.add({ name: 'foo' }, 'testCollection')
						.then(function() {
							return testDb.collection('testCollection').find().limit(1).next();
						})
						.then(function(doc) {
					   		assert.equal(doc.name, 'foo');
						});
				});	
			});	
			

			describe('Read', function() {
				// it('should return empty array if no items exist', function() {
				// 	return dbClient.getAll('testCollection')
				// 		.then(function(items) {
				// 			assert.equal(items.length, 0);
				// 		});
				// });

				// it('should be able to get all items', function() {
				// 	return testDb.collection('testCollection').insertMany([{ name: 'foo' }, { name: 'bar' }])
				// 		.then(function(result) {
				// 			return dbClient.getAll('testCollection');
				// 		})
				// 		.then(function(items) {
				// 			assert.equal(items.length, 2);
				// 		});
				// });

				it('should return null if no item with matching ID', function() {
					return dbClient.get('507f191e810c19729de860ea', 'testCollection')
						.then(function(item) {
							assert.strictEqual(item, null);
						});
				});

				it('should be able to get an item by ID', function() {
					return testDb.collection('testCollection').insertMany([{ name: 'foo' }, { name: 'bar' }])
						.then(function(result) {
							var id = result.insertedIds[1].toString();
							return dbClient.get(id, 'testCollection')
								.then(function(item) {
									assert.equal(item._id, id);
								});
						});
				});
			});

			describe('Update', function() {
				it('should be able to update an item', function() {
					return testDb.collection('testCollection').insertOne({ name: 'foo' })
						.then(function(result) {
							var id = result.insertedId.toString();
							return dbClient.update(id, { name: 'bar' }, 'testCollection');
						})
						.then(function() {
							return testDb.collection('testCollection').find().limit(1).next();
						})
						.then(function(doc) {
					   		assert.equal(doc.name, 'bar');
						});
				});
			});

			describe('Delete', function() {
				it('should be able to remove an item', function() {
					return testDb.collection('testCollection').insertOne({ name: 'foo' })
						.then(function(result) {
							var id = result.insertedId.toString();
							return dbClient.remove(id, 'testCollection');
						})
						.then(function() {
							return testDb.collection('testCollection').find().limit(1).next();
						})
						.then(function(doc) {
					   		assert(!doc);
						});
				});
			});
		});
		
		describe('when performing a field search', function() {
			before(function() {
				return testDb.collection('testCollection').insertMany(data.users)
					.then(function(result) {
						// Create indices for relevant fields
						return testDb.collection('testCollection').createIndex({ 
							userName: 1, 
							firstName: 1,
							lastName: 1
						}, { 
							name: 'fieldSearchIndex' 
						});
					})
					.then(function(indexName) { 
						assert.equal(indexName, 'fieldSearchIndex');
					});
			});

			after(function() {
				return testDb.collection('testCollection').dropIndex('fieldSearchIndex')
					.then(function() {
						return testDb.collection('testCollection').deleteMany({});
					});
			});

			describe('on a single field', function() {
				it('should be able to find items using exact match', function() {
					return dbClient.searchFields([
						{ fieldName: 'userName', query: 'ceblo', fuzzy: false }
					], 'testCollection')
						.then(function(items) {
							assert.equal(items.length, 1);
							assert.equal(items[0].userName, 'ceblo');
						});
				});

				it('should be able to find items using fuzzy match', function() {
					return dbClient.searchFields([
						{ fieldName: 'userName', query: 'eblo', fuzzy: true }
					], 'testCollection')
						.then(function(items) {
							assert.equal(items.length, 1);
							assert.equal(items[0].userName, 'ceblo');
						});
				});
			});

			describe('on multiple fields', function() {
				it('should be able to find items using exact match', function() {
					return dbClient.searchFields([
						{ fieldName: 'firstName', query: 'Cecilia', fuzzy: false },
						{ fieldName: 'lastName', query: 'Blomdahl', fuzzy: false }
					], 'testCollection')
						.then(function(items) {
							assert.equal(items.length, 1);
							assert.equal(items[0].userName, 'ceblo');
						});
				});

				it('should be able to find items using fuzzy match', function() {
					return dbClient.searchFields([
						{ fieldName: 'firstName', query: 'Ce', fuzzy: true },
						{ fieldName: 'lastName', query: 'dahl', fuzzy: true }
					], 'testCollection')
						.then(function(items) {
							assert.equal(items.length, 1);
							assert.equal(items[0].userName, 'ceblo');
						});
				});
			});
		});

		describe('when performing a free text search', function() {
			before(function() {
				return testDb.collection('testCollection').insertMany(data.recipes)
					.then(function(result) {
						// Create indices for relevant fields
						return testDb.collection('testCollection').createIndex({ 
							recipeName: 'text', 
							description: 'text',
							'ingredients.name': 'text'
						}, { 
							name: 'textSearchIndex' 
						});
					})
					.then(function(indexName) { 
						assert.equal(indexName, 'textSearchIndex');
					});
			});

			after(function() {
				return testDb.collection('testCollection').dropIndex('textSearchIndex')
					.then(function() {
						return testDb.collection('testCollection').deleteMany({});
					});
			});

			it('should be able to find items based on a single field', function() {
				return dbClient.searchText('pannbiff', 'testCollection')
					.then(function(items) {
						assert.equal(items.length, 1);
						assert.equal(items[0].id, '6');
					});
			});

			it('should be able to find an item based on multiple fields', function() {
				return dbClient.searchText('champinjonsås', 'testCollection')
					.then(function(items) {
						assert.equal(items.length, 2);
						assert.equal(items[0].id, '8');
						assert.equal(items[1].id, '12');
					});
			});

			it('should be able to find items based on nested fields', function() {
				return dbClient.searchText('mustig kantarell', 'testCollection')
					.then(function(items) {
						assert.equal(items.length, 1);
						assert.equal(items[0].id, '5');
					});
			});
		});
	});
});