"use strict";

var bunyan = require("bunyan");
var express = require("express");
var open = require("open");
var request = require("request");
var conf = require("./conf.json");
var helpers = require("./lib/helpers.js");
var workflowReader = require("./lib/workflowReader.js");
var flow = require("./flow.js")
var logger = bunyan.createLogger({ name: "dwolla-api-workflows-server", serializers: bunyan.stdSerializers });
var app = express();

app.use(express.static("public"));

app.use(function(req, res, next) {
    logger.info(req.method, req.path, req.query, req.headers, req.body ? req.body : "no body" );
    next();
})
/*
    server configurations
*/

/*
    Note:
    ManageCustomers is specific to whitelabel customers, and requires extra steps to turn on in production

    so in production to get a token that can create/manipulate whitelabel customers you need:
    1) A real dwolla account that has the ManageCustomers ability - contact Dwolla to turn this on
    2) An application with the ManageCustomers scope - select this when creating the application
    3) To Request an oauth token that has ManageCustomers scope with your ManageCustomers enabled account.

    These scopes are from part 3. In Dwolla UAT 1 and 2 are taken care of for every user.
*/
var scopes = [
    "Send",
    "Transactions",
    "Balance",
    "Request",
    "Contacts",
    "AccountInfoFull",
    "Funding",
    "ManageAccount",
    "ManageCustomers" 
];

app.get("/oauth_button_path", function(req,res) {
    res.send(
        helpers.oauthHost() + 
        "/v2/authenticate?redirect_url=" + conf.redirect_uri +
        "&client_id=" + 
        encodeURIComponent(conf.key) + 
        "&response_type=code&scope=" + scopes.join("|"));
});

app.get("/oauth", function(req, res) {
    var code = req.query.code;
    goGrabTokenWithCode(code, function(token, refresh, expire_time) {
        helpers.save("access_token", token, function() {
            res.redirect("/#work");
        })
    })
});

var context = {};
app.get("/initialSteps", function(req, res) {
    context = {};
    res.json(workflowReader.getInitialWorkflows());
})

app.get("/nextSteps", function(req, res) {
    res.json(workflowReader.readStepsFor(req.query.fromStep))
})


app.get("/play", function(req, res) {
    var workflow = workflowReader.getStepsForWorkflow(req.query.step);
    var countToWatchFor = countRequestsToWatchFor(workflow);
    logger.info("WAITING FOR "+ countToWatchFor + " REQUESTS")
    var results = [];
    flow(workflow, context, function(requestOptions, response) {
        countToWatchFor--;
        results.push({request: requestOptions, response: response});
        if (countToWatchFor === 0) {
            res.end(JSON.stringify(results));
        }
    })
})

function countRequestsToWatchFor(workflow) {
    var count = 0;
    workflow.forEach(function(e, i) {
        logger.info(e)
        if (e.expand) count += e.expand.length;
        count++;
    })
    return count;
}

function goGrabTokenWithCode(code, func) {
    var data = {
            form: {
                client_id: conf.key,
                client_secret: conf.secret,
                code: code,
                grant_type: "authorization_code",
                redirect_uri: conf.redirect_uri
            }
        };

    request.post(helpers.oauthHost() + "/v2/token", data, function (err, res, body) {
        logger.info("request to server for token", data, "responded with", body)
        var body = JSON.parse(body);
        if (body.error) return logger.warn(body);
        else {
            for (var k in body) helpers.save(k, body[k]);
            func(body.access_token, body.refresh_token, body.expires_in);
            setInterval(refreshToken, body.expires_in/1 * 1000);
        }
    });
}

function refreshToken(func) {
    var data = {
            client_id: conf.key,
            client_secret: conf.secret,
            refresh_token: helpers.load("refresh_token"),
            grant_type: "refresh_token"
        };

    helpers.post(helpers.oauthHost() + "/v2/token", data, function (err, res, body) {
        logger.info("request to server for refreshed token", data, "responded with", body)
        if (err) { func(err) ;return logger.warn(err); }
        var body = JSON.parse(body);
        if (body.error) { func(body); return logger.warn(body); }
        else for (var k in body) helpers.save(k, body[k]);
        func()
    });
}

function startServer() {
    logger.info("Starting server. at port", conf.port);
    app.listen(conf.port);
    var base = "http://localhost:"+conf.port+"/#";
    helpers.save("init", {});
    refreshToken(function(err) {
        if (!err) open(base + "work");
        else open(base + "start");
    })
}

function initialize() {
    startServer();
}

initialize();
