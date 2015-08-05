var express = require('express');
var UserService = require('../core/auth/user-service');
var TokenValidator = require('../core/auth/token-validator');

function UserController(app, userService, tokenValidator) {
	this.userService = userService || new UserService();
	this.tokenValidator = tokenValidator || new TokenValidator();

	var uesrRouter = express.Router();
	app.use('/api/user', uesrRouter);

	// Protect routes
	uesrRouter.use(function(req, res, next) {
		this.tokenValidator.validate(req, res, next);	
	});

	uesrRouter.put('/:userName', function(req, res) {
		this.userService.update(req.params.userName, req.body.user)
			.then(function(response) {
				res.json(200, response);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});
}

module.exports = UserController;

