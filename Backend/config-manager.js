function ConfigManager() {
	this.config = require('./config/config.json');
}

ConfigManager.prototype.getConfigValue = function(key) {
	return this.config[key];
};

module.exports = ConfigManager;