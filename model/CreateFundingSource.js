var silly = require('sillyname');

function randomBankNumber() {
	var n = "";
	for (var i = 0; i < 9; ++i) n += '' + randomInt();
	return n;
}

function randomInt() {
	return Math.floor(Math.random() * 10)
}

module.exports.create = function(context) {
	return {
		"routingNumber": "222222226",
		"accountNumber": randomBankNumber(),
		"type": "checking",
		"name": silly()
	}
}