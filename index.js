var request = require('request');
var cheerio = require('cheerio');

var queue = [];
var seen = {};

var currentCrawlers = 0;
var maxCrawlers = 2;

var crawl = function (url) {
	currentCrawlers++;
	console.log(currentCrawlers, '/', maxCrawlers, 'queue length:', queue.length);
	console.log('crawling ', url);

	seen[url] = 1;
	request(url, function (err, response, body) {
		currentCrawlers--;
		startCrawler();

		if (err || response.statusCode != 200) {
			return;
		}
		
		var contentType = response.headers['content-type'];
		if (!contentType || contentType.indexOf('text/html') === -1) {
			return;
		}

		var $ = cheerio.load(body);
		var $a = $('a');
		var href = $('href');
		
		$a.map(function (i, el) {
			var href = $(el).attr('href');
			
			if (!href) {
				return;
			}

			cleanupUrl(href, function (err, url) {
				if (!err) {
					addToQueue(url);
				}
			});
		});
	});
};

var cleanupUrl = function (url, callback) {
	url = url.split('#')[0];

	var httpOrHttps = /^https?:\/\//i;

	if (httpOrHttps.test(url)) {
		return callback(null, url);
	}
	else {
		return callback(new Error('the given url is not an absolute url!'), null);
	}
};

var addToQueue = function (url) {
	queue.push(url);

	setImmediate(function () {
		startCrawler();
	});
};

var startCrawler = function () {
	if (currentCrawlers < maxCrawlers && queue.length) {
		var urlToCrawl = queue.shift();

		if (!seen[urlToCrawl]) {
			crawl(urlToCrawl);
		}
		else {
			startCrawler();
		}
	}
};

crawl('http://google.com');
