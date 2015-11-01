var assert = require('assert');
var sinon = require('sinon');
var TokenValidator = require('../../app/middleware/token-validator');
var TokenHandler = require('../../app/core/auth/token-handler');

describe('Given a TokenValidator', function() {
	var tokenValidator, req, res, nextFn;

	beforeEach(function() {
		req = { 
			method: 'GET', 
			headers: {
				authorization: 'ABCDEFGH'
			} 
		};
		res = { 
			send: sinon.spy(),
			json: sinon.spy()
		};
		nextFn = sinon.spy();

		tokenValidator = new TokenValidator(null);
	});
	
	it('should always allow OPTIONS requests', function() {
		req.method = 'OPTIONS';
		tokenValidator.validate(req, res, nextFn);
		assert(res.send.calledWith(200));
	});

	it('should return Bad Request (400) if no authorization header set', function() {
		req.headers.authorization = undefined;
		tokenValidator.validate(req, res, nextFn);
		assert(res.json.calledWith(400, sinon.match({ error: 'No token found.' })));
	});

	describe('token is invalid', function() {
		beforeEach(function() {
			var tokenHandler = new TokenHandler();
			sinon.stub(tokenHandler, 'verify').returns(false);

			tokenValidator = new TokenValidator(tokenHandler);
			tokenValidator.validate(req, res, nextFn);
		});

		it('should return Unauthorized (401)', function() {
			assert(res.json.calledWith(401, sinon.match({ error: 'Token is invalid.' })));
		});
	});

	describe('token is valid', function() {
		beforeEach(function() {
			var tokenHandler = new TokenHandler();
			sinon.stub(tokenHandler, 'verify').returns(true);

			tokenValidator = new TokenValidator(tokenHandler);
			tokenValidator.validate(req, res, nextFn);
		});

		it('should delegate to next middleware', function() {
			assert(!res.send.called);
			assert(!res.json.called);
			assert(nextFn.called);
		});
	});
});