var apiRoutes = express.Router(); 

// Token validation middleware
apiRoutes.use(function(req, res, next) {
	var token = req.body.token;

	if (token) {
		jwt.verify(token, 'secret', function(err, decoded) {      
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} 
			else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;    
				next();
			}
		});
	} 
	else {
		return res.json(401, { error: 'Token was invalid.' });
	}
});

app.use('/api', apiRoutes);