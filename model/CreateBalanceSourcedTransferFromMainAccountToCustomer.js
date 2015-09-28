const conf = require('../conf.json');


function base() {
    return (conf.proto || "http") + "://" + (conf.host || "localhost:1788");
}

module.exports.create = function(context) {
    if (!context.customer.id) throw "No customer id to create model!";
    if (!context.account.id) throw "No account id to create model!";
    if (!context.account.fundingSources || context.account.fundingSources.length == 0) throw "No account funding sources to send from!"; 
    var balance = context.account.fundingSources.filter(function(f) { return f.type === "balance" })
    if (balance.length == 0) throw "No balance funding source to send from!";
    balance = balance[0];
    return {
        "_links": {
            "destination": {
                "href": base() + "/customers/" + context.customer.id
            },
            "source": {
                "href": base() + "/accounts/" + context.account.id +"/funding-sources/" + balance.id
            }
        },
        "amount": {
            "currency": "USD",
            "value": "0.10"
        }
    }
}