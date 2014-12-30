var assert = require('assert');
var nock = require('nock');
var proxyquire = require('proxyquire');

describe('Provided a MetainfoStore', function() {
	var metainfoStore;
	var elasticSearchUrl = 'http://local:9200';

	beforeEach(function() {
		metainfoStore = proxyquire('../metainfo-store', {
			'./config-manager': {
				getConfigValue: function(configKey) { return 'local' }
			}
		});
	});

	describe('when adding a metainfo key', function() {
		it('should return error if no key is provided', function(done) {
			metainfoStore.addKey(undefined, undefined, function(error) {
				assert(error.length);
				done();
			});
		});

		it('should return error if ElasticSearch does not reply with HTTP 200', function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/meta/keys')
				.reply(404);

			metainfoStore.addKey('newKey', undefined, function(error) {
				assert(error.length);
				done();
			});
		});

		it('should return error if key already exists', function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/meta/keys')
				.reply(200, {
					"_source": {
				    	"keys": ['key1']
					}
				});

			metainfoStore.addKey('key1', undefined, function(error) {
				assert(error.length);
				done();
			});
		});

		it('should add the key otherwise', function(done) {
			nock(elasticSearchUrl)
				.get('/reciperepo/meta/keys')
				.reply(200, {
					"_source": {
				    	"keys": ['key1']
					}
				});

			nock(elasticSearchUrl)
				.post('/reciperepo/meta/keys')
				.reply(200);

			metainfoStore.addKey('key2', function(result) {
				assert(result.length);
				done();
			});
		});
	});
});	