var helpers = require("../lib/helpers.js");

module.exports.initial = true;
module.exports.description = "Gets the list of customers associated with the main account.";
module.exports.nextSteps = [];

module.exports.steps = [
    {
        endpoint : "customers",
        method : "get",
        extractor : function(response, context) {
            context.customers = response.body
        }
    }
];