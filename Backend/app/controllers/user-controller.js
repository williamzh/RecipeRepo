var express = require('express');
var UserService = require('../core/user-service');
var TokenValidator = require('../middleware/token-validator');

function UserController(app, userService, tokenValidator) {
	this.userService = userService || new UserService();
	this.tokenValidator = tokenValidator || new TokenValidator();

	var userRouter = express.Router();
	app.use('/api/user', userRouter);

	// Protect routes
	userRouter.use(function(req, res, next) {
		this.tokenValidator.validate(req, res, next);	
	});

	userRouter.get('/:userName', function(req, res) {
		this.userService.get(req.params.userName)
			.then(function(user) {
				res.json(200, user);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	userRouter.put('/:userName', function(req, res) {
		this.userService.update(req.params.userName, req.body.user)
			.then(function() {
				res.json(200);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	userRouter.delete('/:userName', function(req, res) {
		if(!req.params.userName) {
			res.json(400, { error: 'User name must be provided.' });
			return;
		}

		this.userService.remove(req.params.userName)
			.then(function() {
				res.json(200);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	userRouter.post('/search', function(req, res) {
		if(!req.body.query) {
			res.json(400, { error: 'Search query must be provided.' });
			return;
		}

		this.userService.search(req.body.query)
			.then(function(hits) {
				res.json(200, hits);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});
}

module.exports = UserController;

