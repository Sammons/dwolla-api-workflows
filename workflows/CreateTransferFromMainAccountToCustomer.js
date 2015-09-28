var helpers = require("../lib/helpers.js");

module.exports.description = "Creates a balance sourced transfer to a customer.";
module.exports.nextSteps = [];

module.exports.steps = [
    {
        endpoint : "transfers",
        method : "post",
        model : "CreateBalanceSourcedTransferFromMainAccountToCustomer",
        extractor : function(response, context) {
            context.transfer = {};
            context.transfer.id = response.headers['location'].split('/')[4];
        }
    }
];