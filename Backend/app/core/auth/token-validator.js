var jwt = require('jsonwebtoken'); 

function TokenValidator() {}

TokenValidator.prototype.validate = function(req, res, next) {
	if (req.method == 'OPTIONS') {
		res.send(200);
	}

	var token = req.headers.authorization;

	if (token) {
		jwt.verify(token, 'secret', function(err, decoded) {      
			if (err) {
				return res.json(401, { error: 'Failed to authenticate token. ' + err });    
			} 
			else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;    
				next();
			}
		});
	} 
	else {
		return res.json(401, { error: 'No token found.' });
	}
};

module.exports = TokenValidator;