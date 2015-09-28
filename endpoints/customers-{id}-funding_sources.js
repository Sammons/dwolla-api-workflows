
function apiPath(context) {
	return '/customers/'+context.customer.id + '/funding-sources';
}

module.exports.post = function(context, model) {
	return {
		path: apiPath(context),
		body: model
	};
};

module.exports.get = function(context, model) {
    return {
        path: apiPath(context)
    };
};