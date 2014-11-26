var DatabaseConnector = require('./DatabaseConnector');
var TextToMMLConverter = require('./TextToMMLConverter');

var db = new DatabaseConnector();
var converter = new TextToMMLConverter(db);

converter.getRandomSnippet(function (err, snippet) {
	if (err) {
		console.log(err);
		return;
	}

	console.log(snippet);
});