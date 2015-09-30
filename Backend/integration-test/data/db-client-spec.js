var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var sinon = require('sinon');
var ConfigManager = require('../../app/config/config-manager');
var DbClient = require('../../app/data/db-client');

var conenctionUrl = 'mongodb://localhost:27017/integration_test';

describe('Given a dbClient', function() {
	var dbClient;

	beforeEach(function() {
		var configManager = new ConfigManager();
		sinon.stub(configManager, 'getConfigValue').returns(conenctionUrl);

		dbClient = new DbClient(configManager);
	});

	afterEach(function(done) {
		MongoClient.connect(conenctionUrl, function(err, db) {
			db.collection('testCollection').deleteMany({}, function(err, result) {
				assert(!err);
				db.close();
				done();
			});
		});
	});

	it('should be able to insert an item', function(done) {
		dbClient.add({ id: 1 }, 'testCollection')
			.then(function() {
				MongoClient.connect(conenctionUrl, function(err, db) {
					db.collection('testCollection').find({ id: 1 }).limit(1).next(function(err, doc) {
					   		assert.equal(1, doc.id);
					        db.close();
					        done();
						});
					});
			})
			.catch(function(err) {
				assert.fail(null, null, 'Insert failed. ' + err.message, ',');
			});
	});

	it('should be able to get all items', function(done) {
		MongoClient.connect(conenctionUrl, function(err, db) {
			db.collection('testCollection').insertMany([{ id: 1 }, { id: 2 }], function(err, result) {
				dbClient.getAll('testCollection')
					.then(function(items) {
						assert.equal(2, items.length);
						db.close();
						done();
					})
					.catch(function(err) {
						assert.fail(null, null, 'Get all failed. ' + err.message, ',');
					});
			});
		});
	});

	it('should be able to get an item by ID', function(done) {
		MongoClient.connect(conenctionUrl, function(err, db) {
			db.collection('testCollection').insertMany([{ id: 1 }, { id: 2 }], function(err, result) {
				dbClient.get(2, 'testCollection')
					.then(function(item) {
						assert.equal(2, item.id);
						db.close();
						done();
					})
					.catch(function(err) {
						assert.fail(null, null, 'Get (by ID) failed. ' + err.message, ',');
					});
			});
		});
	});

	it('should be able to update an item', function(done) {
		MongoClient.connect(conenctionUrl, function(err, db) {
			db.collection('testCollection').insertMany([{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }], function(err, result) {
				dbClient.update(1, { id: 1, name: 'fu' }, 'testCollection')
					.then(function() {
						db.collection('testCollection').find({ id: 1 }).limit(1).next(function(err, doc) {
					   		assert.equal('fu', doc.name);
					        db.close();
					        done();
						});
					})
					.catch(function(err) {
						assert.fail(null, null, 'Update failed. ' + err.message, ',');
					});
			});
		});
	});

	it('should be able to remove an item', function(done) {
		MongoClient.connect(conenctionUrl, function(err, db) {
			db.collection('testCollection').insertOne({ id: 1, name: 'foo' }, function(err, result) {
				dbClient.remove(1, 'testCollection')
					.then(function() {
						db.collection('testCollection').find({ id: 1 }).limit(1).next(function(err, doc) {
					   		assert(!doc);
					        db.close();
					        done();
						});
					})
					.catch(function(err) {
						assert.fail(null, null, 'Remove failed. ' + err.message, ',');
					});
			});
		});
	});
});