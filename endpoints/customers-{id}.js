const path = require('path');

function apiPath(context) {
	return '/customers/'+context.customer.id;
}

module.exports.get = function(context) {
	return {
		path: apiPath(context)
	}
}