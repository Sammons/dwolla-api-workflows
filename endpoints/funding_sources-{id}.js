const path = require('path');

function apiPath(context) {
	return '/funding-sources/' + context.fundingSource.id;
}

module.exports.get = function(context) {
	return {
		path: apiPath(context)
	}
}


module.exports.delete = function(context) {
	return {
		path: apiPath(context)
	}
}