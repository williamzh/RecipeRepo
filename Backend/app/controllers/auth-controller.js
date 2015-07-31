var express = require('express');
var UserService = require('../core/auth/user-service');

function AuthController(app, userService) {
	this.userService = userService || new UserService();

	var authRouter = express.Router();
	app.use('/auth', authRouter);

	// POST /auth/login
	authRouter.post('/login', function(req, res) {
		this.userService.authenticate(req.body.userName, req.body.password)
			.then(function(token) {
				res.json(200, token);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});
}

module.exports = AuthController;

