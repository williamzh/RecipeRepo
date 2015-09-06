var express = require('express');
var UserService = require('../core/auth/user-service');

function AuthController(app, userService) {
	this.userService = userService || new UserService();

	var authRouter = express.Router();
	app.use('/auth', authRouter);

	authRouter.post('/register', function(req, res) {
		this.userService.add(req.body.user)
			.then(function() {
				res.json(200);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});

	authRouter.post('/login', function(req, res) {
		this.userService.authenticate(req.body.userName, req.body.password)
			.then(function(token) {
				res.json(200, token);
			}).catch(function(err) {
				res.json(500, { error: err });
			});
	});

	authRouter.post('/reset', function(req, res) {
		var userService = this.userService;

		userService.search(req.body.email)
			.then(function(hits) {
				if(hits.length == 0) {
					throw new Error('User with email ' + req.body.email + ' not found.');
				}

				// TODO: what to do if more than one hit?
				var user = hits[0];

				// TODO: send mail (Nodemailer?)

				// Update user password
				user.password = 'temp';
				return this.userService.update(user.userName, user);
			})
			.then(function() {
				res.json(200);
			})
			.catch(function(err) {
				res.json(500, { error: err });
			});
	});
}

module.exports = AuthController;