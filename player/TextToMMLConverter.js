
function TextToMMLConverter(db) {
	this.db = db;
}

TextToMMLConverter.prototype.getDuration = function () {
	return Math.round(Math.random() * 9);
};

TextToMMLConverter.prototype.updateOctave = function () {
	var rand = Math.round(Math.random() * 9);

	if (rand == 1) {
		return '<';
	}
	else if (rand == 2) {
		return '>';
	}

	return '';
};

TextToMMLConverter.prototype.getRandom = function (max) {
	return Math.floor(Math.random() * max) * 100;
};

TextToMMLConverter.prototype.convert = function (text) {
	var notes = text.toLowerCase();
	var convertedItem = '';

	//notes = notes.replace(/[^cdefgab]/g, '');
	notes = notes.replace(/[^cdega]/g, '');

	console.log(notes.length);
	for (var i = 0; i < notes.length; i++) {
		convertedItem += this.updateOctave() + notes[i] + this.getDuration();
	}

	return {
		//attack: this.getRandom(text.length),
		release: this.getRandom(convertedItem.length),
		lv: Math.random(),
		length: text.length,
		mml: convertedItem
	};
};

TextToMMLConverter.prototype.getRandomSnippet = function (callback) {
	var _this = this;

	this.db.getRandomItem(function (err, item) {
		if (err) {
			return callback(err, null);
		}

		return callback(null, _this.convert(item));
	});
};

module.exports = TextToMMLConverter;