
function apiPath(context) {
	return '/transfers';
}

module.exports.get = function(method, context) {
	return {
		path: apiPath(context)
	};
};

module.exports.post = function(context, model) {
	return {
		path: apiPath(context),
		body: model
	};
};