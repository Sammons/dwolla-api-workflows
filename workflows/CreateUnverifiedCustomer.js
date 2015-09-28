var helpers = require("../lib/helpers.js");

module.exports.description = "Creates a customer that can receive money once a funding source is created.";
module.exports.nextSteps = [
    "CreateFundingSourceForCustomer"
];

module.exports.steps = [
    {
        endpoint : "customers",
        method : "post",
        model : "CreateUnverifiedCustomer",
        extractor : function(response, context) {
                context.customer = {};
                context.customer.id = response.headers['location'].split('/')[4];
        }
    },
    {
        endpoint : "customers/{id}",
        method : "get",
        extractor : function(response, context) {
            context.customer = response.body
        }
    }
];