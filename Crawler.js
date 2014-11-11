var request = require('request');
var cheerio = require('cheerio');

var Crawler = function (url, addToQueue, onRequestFinishedCallback) {
	this.url = url;
	this.addToQueue = addToQueue;
	this.onRequestFinishedCallback = onRequestFinishedCallback;

	this.crawl();
};

Crawler.prototype.crawl = function () {
	var _this = this;

	request(this.url, function (err, response, body) {
		// start new crawler
		_this.onRequestFinishedCallback();
		
		if (err || response.statusCode != 200) {
			return;
		}
		
		var contentType = response.headers['content-type'];
		if (!contentType || contentType.indexOf('text/html') === -1) {
			return;
		}

		var $ = cheerio.load(body);
		_this.findNewLinks($);
	});
};

Crawler.prototype.cleanupUrl = function (url, callback) {
	url = url.split('#')[0];

	var httpOrHttps = /^https?:\/\//i;

	if (httpOrHttps.test(url)) {
		return callback(null, url);
	}
	else {
		return callback(new Error('the given url is not an absolute url!'), null);
	}
};

Crawler.prototype.analyseBody = function ($) {

};

Crawler.prototype.findNewLinks = function ($) {
	var _this = this;
	var $a = $('a');
		
	$a.map(function (i, el) {
		var href = $(el).attr('href');
		
		if (!href) {
			return;
		}

		_this.cleanupUrl(href, function (err, url) {
			if (!err) {
				_this.addToQueue(url);
			}
		});
	});
};

module.exports = Crawler;