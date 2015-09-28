var endpoint = require('./endpoint.js'),
	async = require('async'),
	util = require('util'),
	bunyan = require("bunyan"),
	logger = bunyan.createLogger({ name: "dwolla-api-workflows-server", serializers: bunyan.stdSerializers }),
	silly = require('sillyname'),
	helpers =require("./lib/helpers.js"),
	report,
	context;


function extractIdFromLocation(href) {
	return href.split('/')[4];
}

function wrapRelationForAsyncParallel(response, prop, context) {
	return function (cb) {
		helpers.request(response.body._links[prop].href, "GET", "", function(err, res, request) {
			if (err) return cb(err);
			logger.info("GET : "+ response.body._links[prop].href);
			response.body._links[prop] = JSON.parse(res.body);
			report(request, helpers.extractResponseFromFullResponse(res));
			cb(null, response);
		})
	}
}

function wrapRelationsForAsyncParallel(response, propertiesToExpand, context) {
	var items = [];
	for (var i in propertiesToExpand) {
		items.push(wrapRelationForAsyncParallel(response, propertiesToExpand[i], context))
	}
	return items;
} 

function expandRelations(response, propertiesToExpand, context, done) {
	async.parallel(wrapRelationsForAsyncParallel(response, propertiesToExpand, context), done);
}

function processItem(item, context, cb) {
	var model = item.model;
	if (typeof(item.model) !== typeof("") && item.model !== undefined) {
		model = item.model(context);
	}
	endpoint(item.endpoint, item.method, context, report, model).execute(function(err, response) {
		if (err) return cb();
		if (!item.expand || item.expand.length == 0) {
			if (item.extractor)
				item.extractor(response, context);
			cb();
		} else {
			expandRelations(response, item.expand, context, function() {
				if (item.extractor)
					item.extractor(response, context);
				cb();
			});
		}
	})
}

function wrapWorkflowItemForAsyncWaterfall(item, context) {
	return function(cb, prev) {
		processItem(item, context, cb)
	};
}

function wrapWorkflowItemsForAsyncWaterfall(workflow) {
	var items = [];
	for (var i in workflow) {
		items.push(wrapWorkflowItemForAsyncWaterfall(workflow[i], context));
	}
	return items;
}

function runWorkflow(workflow, name, seriesCb) {
	async.waterfall(wrapWorkflowItemsForAsyncWaterfall(workflow), function(err, result) {
		seriesCb(err, result);
	});
}

function wrapWorkFlow(workflow, name) {
	return function(cb) {
		runWorkflow(workflow, name, cb);
	}
}

function wrapWorkflowsForAsync(workflows) {
	var wrappedFlows = [];
	for (var key in workflows) {
		wrappedFlows.push(wrapWorkFlow(workflows[key], key));
	}
	return wrappedFlows;
}

module.exports = function(workflows, cont, reporter, cb) {
	report = reporter;
	workflows = [workflows];
	context = cont;
	async.series(wrapWorkflowsForAsync(workflows), function() {
		if (cb) cb();
	});
}
