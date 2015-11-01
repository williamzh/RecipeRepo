var jwt = require('jsonwebtoken'); 

function TokenHandler() {}

TokenHandler.prototype.issue = function(payload) {
	return jwt.sign(payload, 'secret', {
		expiresIn: 3600
	});
};

TokenHandler.prototype.verify = function(token) {
	if(!token) {
		return false;
	}

	try {
		var decoded = jwt.verify(token, 'secret');
		return true;
	} 
	catch(error) {
		// TODO: log
		return false;
	}
};

module.exports = TokenHandler;