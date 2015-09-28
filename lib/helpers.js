var config = require("../conf.json");
var request = require("request");
var Store = new require('jfs');
var storage = new Store("data", { type: "single", pretty: "true" });

module.exports.hosts = function() {
    switch(config.env || "uat") {
    case "uat" :
        return {
            OAUTH_HOST: 'https://uat.dwolla.com/oauth',
            API_HOST:  'https://api-uat.dwolla.com/'
        }

    case "prod" :
        return {
            OAUTH_HOST: 'https://www.dwolla.com/oauth/v2',
            API_HOST:  'https://www.dwolla.com/oauth/v2/rest'
        }
    }
}

module.exports.apiHost = function() {
    return module.exports.hosts().API_HOST;
}

module.exports.oauthHost = function() {
    return module.exports.hosts().OAUTH_HOST;
}

module.exports.url = function(path) {
    if (path[0] === "/") path = path.substring(1);
    var url = module.exports.apiHost() + "/" + path;
    return url.replace(/\/\//g, "/").replace(/\:\//,"://");
};

module.exports.v2headers = function() {
    return {
            "Content-Type" : "application/json",
            "Accept" : "application/vnd.dwolla.v1.hal+json",
            "Authorization" : "Bearer " + storage.getSync("access_token"),
            "User-Agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36"         
        };
}

module.exports.save = function(key, value, callback) {
    storage.saveSync(key, value);
    if (typeof callback !== 'undefined') callback();
}

module.exports.load = function(key) {
    return storage.getSync(key);
}

module.exports.request = function(url, method, body, func) {
    var options = {
        url : url,
        body : JSON.stringify(body),
        headers : module.exports.v2headers(),
        method : method.trim().toUpperCase()
    };
    request(options, function(err, response) {
        func(err, response, options);
    });
}

module.exports.post = function(url, body, func) {
    var options = {
        url : url,
        body : JSON.stringify(body),
        headers : module.exports.v2headers(),
        method : "POST"
    };
    request(options, func);
}

module.exports.get = function(url, func) {
    var options = {
        url : url,
        headers : module.exports.v2headers(),
        method : "GET"
    };
    request(options, func);
}

module.exports.extractResponseFromFullResponse = function(fullResponse) {
    var body = {};
    if (typeof(fullResponse.body) === typeof({})) 
        body = fullResponse.body;
    else if (fullResponse.body) {
        body = JSON.parse(fullResponse.body);
    }
    var response = {
        statusCode: fullResponse.statusCode,
        statusMessage: fullResponse.statusMessage,
        body: body,
        headers: fullResponse.headers
    };
    return response;
}