
function apiPath(context) {
	return '/accounts/' + context.account.id + '/funding-sources';
}


module.exports.get = function(context) {
	return {
		path: apiPath(context)
	};
}