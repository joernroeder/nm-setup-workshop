
function TextToMMLConverter(db) {
	this.db = db;
}

TextToMMLConverter.prototype.convert = function (text) {
	var convertedItem = text;

	return convertedItem;
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