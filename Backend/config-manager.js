exports = module.exports = (function configManager() {
   	var config = require('./config/config.json');

   	function getConfigValue(key) {
   		return config[key];
   	}

   	return {
   		getConfigValue: getConfigValue
   	};
})();