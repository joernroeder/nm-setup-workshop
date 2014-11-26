var Pool = require('./Pool.js');
var Crawler = require('./Crawler');

var pool = new Pool(10, Crawler);

pool.addToQueue('http://spiegel.de', function () {
	pool.startCrawler();
});