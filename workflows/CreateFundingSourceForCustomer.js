var helpers = require("../lib/helpers.js");

module.exports.description = "Adds a funding source to a customer's account.";
module.exports.nextSteps = [
    "CreateTransferFromMainAccountToCustomer"
];

module.exports.steps = [
    {
        endpoint : "customers/{id}/funding-sources",
        method : "post",
        model : "CreateFundingSource"
    },
    {
        endpoint : "customers/{id}/funding-sources",
        method : "get",
        extractor : function(response, context) {
            context.customer.fundingSources = response.body._embedded['funding-sources']
        }
    }
];