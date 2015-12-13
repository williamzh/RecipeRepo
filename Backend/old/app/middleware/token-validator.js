var TokenHandler = require('../core/auth/token-handler');

function TokenValidator(tokenHandler) {
	this.tokenHandler = tokenHandler || new TokenHandler();
}

TokenValidator.prototype.validate = function(req, res, next) {
	// Allow CORS preflight requests
	if (req.method == 'OPTIONS') {
		res.send(200);
		return;
	}

	var token = req.headers.authorization;
	if(!token) {
		res.json(401, { error: 'No token found.' });
		return;
	}

	var isTokenValid = this.tokenHandler.verify(token);
	if (!isTokenValid) {		
		res.json(401, { error: 'Token is invalid.' });
		return;
	}
		
	next();
};

module.exports = TokenValidator;