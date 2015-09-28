
function apiPath(context) {
    return '/accounts/' + context.account.id;
}


module.exports.get = function(context) {
    return {
        path: apiPath(context)
    };
}