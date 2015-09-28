const path = require('path'),
	bunyan = require("bunyan"),
	logger = bunyan.createLogger({ name: "dwolla-api-workflows-server", serializers: bunyan.stdSerializers }),
	helpers = require("./lib/helpers.js")
	conf = require('./conf.json');

module.exports = function(apiPath, method, entities, report, model) {
	var file_for_path = apiPath.replace(/-/g,'_').replace(/\//g,'-').trim()+".js";
	if (apiPath.trim() === "/") file_for_path = "root.js";
	if (method) method = method.toLowerCase().trim()
	if (method === "post" && !model) throw "No model given to be body for POST request!";

	var path_methods = require('./endpoints/'+file_for_path);
	if (!path_methods[method.toLowerCase()]) {
		logger.info("method "+method+" not found for path "+apiPath);
		return;
	}

	if (typeof(model) === typeof(""))
		model = require('./model/'+model+'.js').create(entities);

	var endpoint = path_methods[method](entities, model);

	var url = helpers.url(endpoint.path);
	endpoint.execute = function(callback) {
		helpers.request(url, method, endpoint.body || "", function(err, result, request) {
			if (err) {
				report(request, {error: err});
				return callback(err, result);
			}
			var response = helpers.extractResponseFromFullResponse(result)
			logger.info(method + ": "+ endpoint.path);
			if (method === "post") logger.info("\n request body - " + JSON.stringify(endpoint.body, null, 5) /* pretty print */ );
			
			if ((result.statusCode+'')[0] !== '2')  {
				logger.info("Failure: "+result.statusCode);
				logger.info("Failure response:\n", JSON.stringify(result.body, null, 5));
				report(request, response);
				return callback(result.statusCode);
			}

			logger.info("Success: "+result.statusCode);
			report(request, response);
			callback(err, response)
		})
	}
	return endpoint;
}

