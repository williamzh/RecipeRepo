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

	userRouter.get('/:userId', function(req, res) {
		this.userService.get(req.params.userId)
			.then(function(user) {
				res.json(200, user);
			})
			.catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	userRouter.put('/:userId', function(req, res) {
		this.userService.update(req.params.userId, req.body.user)
			.then(function() {
				res.json(200);
			})
			.catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	userRouter.delete('/:userId', function(req, res) {
		if(!req.params.userId) {
			res.json(400, { error: 'User name must be provided.' });
			return;
		}

		this.userService.remove(req.params.userId)
			.then(function() {
				res.json(200);
			})
			.catch(function(err) {
				res.json(500, { error: err.message });
			});
	});
}

module.exports = UserController;

