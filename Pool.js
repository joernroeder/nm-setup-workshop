var Pool = function (maxCrawlers, Crawler) {
	this.currentCrawlers = 0;
	this.maxCrawlers = maxCrawlers;

	this.queue = [];
	this.seen = {};

	this.Crawler = Crawler;
};

Pool.prototype.addCrawler = function () {
	var _this = this;

	this.getFromQueue(function (err, url) {
		if (err || !url) {
			return;
		}

		_this.addToSeen(url, function () {
			_this.currentCrawlers++;
			new _this.Crawler(url, function (url) {
				_this.addToQueue(url);
			}, function () {
				_this.currentCrawlers--;

				// start new crawler
				_this.startCrawler();
			});
		});
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
	return callback(null, this.queue.shift());
};

Pool.prototype.addToQueue = function (url, callback) {
	var _this = this;

	this.queue.push(url);

	if (this.canCreateNewCrawler()) {
		setImmediate(function () {
			_this.startCrawler();
		});
	}

	if (callback) {
		return callback();
	}
};

Pool.prototype.addToSeen = function (url, callback) {
	this.seen[url] = 1;

	return callback();
};

Pool.prototype.hasSeen = function (url, callback) {
	var hasSeen = this.seen[url] ? true : false;

	return callback(null, hasSeen);
};

module.exports = Pool;