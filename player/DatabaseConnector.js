var redis = require('redis');
var client = redis.createClient();

function DatabaseConnector () {
}

DatabaseConnector.prototype.getRandomItem = function (callback) {
	client.srandmember('items', callback);
};

module.exports = DatabaseConnector;