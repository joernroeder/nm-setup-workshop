var Blake2s = require('blake2s');

var redis = require('redis');
var client = redis.createClient();

client.on('error', function (err) {
	console.log('Redis Error: ' + err);
});

var Pool = function (maxCrawlers, Crawler) {
	this.currentCrawlers = 0;
	this.maxCrawlers = maxCrawlers;

	this.Crawler = Crawler;
};

Pool.prototype.addCrawler = function (url) {
	var _this = this;

	var crawlerApi = {
		addToQueue: function (urlToAdd) {
			_this.addToQueue(urlToAdd);
		},

		onRequestFinishedCallback: function () {
			_this.currentCrawlers--;

			// start new crawler
			_this.startCrawler();
		},

		saveItem: function (url, item) {
			_this.saveItem(url, item);
		}
	};

	_this.addToSeen(url, function () {
		_this.currentCrawlers++;
		new _this.Crawler(url, crawlerApi);
	});
};

Pool.prototype.canCreateNewCrawler = function () {
	return this.currentCrawlers < this.maxCrawlers ? true : false;
};

Pool.prototype.startCrawler = function () {
	var _this = this;

	if (!this.canCreateNewCrawler()) {
		return;
	}

	this.getFromQueue(function (err, url) {
		if (err || !url) {
			return;
		}

		_this.hasSeen(url, function (err, hasSeen) {
			if (!hasSeen) {
				_this.addCrawler(url);
			}
			else {
				_this.startCrawler();
			}
		});
	});
};

Pool.prototype.getFromQueue = function (callback) {
	client.spop('queue', callback);
};

Pool.prototype.addToQueue = function (url, callback) {
	var _this = this;

	client.sadd('queue', url, callback);

	if (this.canCreateNewCrawler()) {
		setImmediate(function () {
			_this.startCrawler();
		});
	}
};

Pool.prototype.convertUrlToHash = function (url) {
	return new Blake2s().update(url).digest('hex');
};

Pool.prototype.addToSeen = function (url, callback) {
	client.set(this.convertUrlToHash(url), 1, callback);
};

Pool.prototype.hasSeen = function (url, callback) {
	client.get(this.convertUrlToHash(url), function (err, reply) {
		var hasSeen = reply ? true : false;

		return callback(null, hasSeen);
	});
};

Pool.prototype.saveItem = function (url, item) {
	console.log('saving item', item);
	client.sadd('items', item);
};

module.exports = Pool;