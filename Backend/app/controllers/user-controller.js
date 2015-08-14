var express = require('express');
var UserService = require('../core/auth/user-service');
var TokenValidator = require('../core/auth/token-validator');

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
			.then(function(response) {
				res.json(200, response);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});

	userRouter.put('/:userName', function(req, res) {
		this.userService.update(req.params.userName, req.body.user)
			.then(function(response) {
				res.json(200, response);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});
}

module.exports = UserController;

