var helpers = require("../lib/helpers.js");

module.exports.initial = true;
module.exports.description = "Gets information about the main account, this information is needed for most subsequent actions";
module.exports.nextSteps = [
    "GetAccountFundingSources",
    "GetCustomers",
    "CreateUnverifiedCustomer"
];

module.exports.steps = [
    {
        endpoint : "/",
        method : "get",
        expand : [
            "account"
        ],
        extractor : function(response, context) {
            context.account = response.body._links.account;
        }
    },
    {
        endpoint : "accounts/{id}/funding-sources",
        method : "get",
        extractor : function(response, context) {
            context.account.fundingSources = response.body._embedded['funding-sources'];
        }
    }
];