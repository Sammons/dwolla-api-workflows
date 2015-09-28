#Dwolla Workflows (API V2)

The point of this application is to prototype usages of Dwolla's V2 API. It is designed for use by developers, so don't be afraid to tweak things, or peek under the hood.

If you want to see how the API behaves - headers, body, etc.  you are in the right place!

I do my best to keep it up to date, but Dwolla's API v2 is currently under development - so apologies if things break.

Also - the workflows are strongly tailored to whitelabel dwolla api users, since that's the most fun Dwolla thing that can be done without having to set up multiple accounts in UAT. Whitelable let's you create customers and then send money to their accounts.

#Getting Started (with the UI)

* get node.js on your system if you haven't got it. (https://nodejs.org/en/download/)
* `npm install`
* `node app`
* A web page should appear in your default browser, by default the app will direct you through a UAT flow, which means you don't need to input real data.

#Configurations

There is a conf.json file with application credentials, the current ones there are for Dwolla's sandbox environment, feel free to use them though note that if you behave badly Dwolla will block the test account.

If you are new to Dwolla's api go to https://docsv2.dwolla.com/ to learn about getting started with the api.

If you do set your own credentials, make sure you set your applications oauth redirect to the same thing that is in the conf.json file.

#License

MIT

#Contributors

Pull requests are welcome!