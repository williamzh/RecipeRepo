require('sugar');

function IdGenerator() { }

/**
 * Generates a numeric unique ID. If a seed array is provided, the ID will 
 * be the first available value that isn't in the array.
 * @param {Array} seeds: An array of existing numeric IDs.
 * @param {Boolean} incremental: (optional) If set to true, newly generated
 * IDs will never be smaller than the largest existing ID.
 * @returns {Number} A numerically unique ID.
 */
IdGenerator.prototype.generateId = function(seeds, incremental) {
	var ids = seeds || [];

	var id = 1;

	if(incremental === true) {
		id = seeds.max() + 1;
	}
	else {
		while(ids.indexOf(id) > -1) {
			id++;
		}
	}

	return id;
}

module.exports = IdGenerator;