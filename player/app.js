var T = require('timbre');

var DatabaseConnector = require('./DatabaseConnector');
var TextToMMLConverter = require('./TextToMMLConverter');

var db = new DatabaseConnector();
var converter = new TextToMMLConverter(db);

var playSnippet = function () {
	converter.getRandomSnippet(function (err, snippet) {
		if (err) {
			console.log(err);
			return;
		}

		console.log(snippet.mml);

		var gen = T('OscGen', {
			env: {
				type	: 'perc',
				a		: snippet.attack,
				r		: snippet.release,
				lv		: snippet.lv
			}
		})
		.play();

		T('mml', { mml: snippet.mml }, gen)
			.on('ended', function () {
				playSnippet();
			})
			.start();
	});
};

for (var i = 0; i < 5; i++) {
	playSnippet();
}