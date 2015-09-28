var fs = require("fs");
var bunyan = require("bunyan");
var logger = bunyan.createLogger({ name: "dwolla-api-workflows-server", serializers: bunyan.stdSerializers });

var workflowDir = "./workflows/"

var stepsAvailable = {};
var workflowFiles = fs.readdirSync(workflowDir);
workflowFiles.forEach(function(e, i) {
    stepsAvailable[e.replace(".js","")] = require("."+workflowDir + e);
});
var stepsKeys = Object.keys(stepsAvailable);

logger.info("reading workflows", workflowFiles);

module.exports.getInitialWorkflows = function() {
    var initialWorkFlowInformation = [];
    stepsKeys.forEach(function(e,i) {
        if (stepsAvailable[e].initial === true)
            initialWorkFlowInformation.push({ name: e, description: stepsAvailable[e].description })
    });
    logger.info("initial workflows", initialWorkFlowInformation);
    return initialWorkFlowInformation;
}

module.exports.readStepsFor = function(fromStep) {
    var steps = [];
    stepsAvailable[fromStep.trim()].nextSteps.forEach(function(e,i) {
        if (stepsAvailable[e])
            steps.push({ name: e, description: stepsAvailable[e].description });
    })
    logger.info("next steps for", fromStep, steps);
    return steps;
}

module.exports.getStepsForWorkflow = function(step) {
    if (!stepsAvailable[step]) return [];
    return stepsAvailable[step].steps;
}