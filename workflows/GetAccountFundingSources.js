var helpers = require("../lib/helpers.js");

module.exports.description = "Gets funding sources attached to the main account. Money can be transferred to and from these.";
module.exports.nextSteps = [];

module.exports.steps = [
    {
        endpoint : "accounts/{id}/funding-sources",
        method : "get",
        extractor : function(response, context) {
            context.account.fundingSources = response.body._embedded['funding-sources'];
        }
    }
];