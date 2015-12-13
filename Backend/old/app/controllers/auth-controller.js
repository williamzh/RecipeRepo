var express = require('express');
var UserService = require('../core/user-service');

function AuthController(app, userService) {
	this.userService = userService || new UserService();

	var authRouter = express.Router();
	app.use('/auth', authRouter);

	authRouter.post('/register', function(req, res) {
		if(!req.body.user) {
			res.json(400, { error: 'User must be provided.' });
			return;
		}

		this.userService.add(req.body.user)
			.then(function() {
				res.json(200);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	authRouter.post('/login', function(req, res) {
		if(!req.body.userName || !req.body.password) {
			res.json(400, { error: 'Username and password must be provided.' });
			return;
		}

		this.userService.authenticate(req.body.userName, req.body.password)
			.then(function(token) {
				res.json(200, token);
			}).catch(function(err) {
				res.json(500, { error: err.message });
			});
	});

	authRouter.post('/reset', function(req, res) {
		if(!req.body.email) {
			res.json(400, { error: 'Email must be provided.' });
			return;
		}

		// TODO: move logic to user service
		var self = this;
		this.userService.search(req.body.email)
			.then(function(hits) {
				if(hits.length == 0) {
					throw new Error('User with email ' + req.body.email + ' not found.');
				}

				// TODO: what to do if more than one hit?
				var user = hits[0];

				// TODO: send mail (Nodemailer?)

				// Update user password
				user.password = 'temp';
				return self.userService.update(user.userName, user);
			})
			.then(function() {
				res.json(200);
			})
			.catch(function(err) {
				res.json(500, { error: err.message });
			});
	});
}

module.exports = AuthController;