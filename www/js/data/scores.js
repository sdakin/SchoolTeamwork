/**
 * A value object that handles all of the data for an individual score record.
 *
 * @class ScoreRecord
 * @extends ChangeObject
 * @constructor
 * @param {String} scorerID the ID of the user doing the scoring.
 * @param {String} scoreeID the ID of the user being scored.
 * @param {Object} scoreData an object hash of score data (<categoryName>: <scoreValue>).
 */
function ScoreRecord(scorerID, scoreeID, scoreData) {
	ChangeObject.call(this);

	// set up the ChangeObject data property
	this.data = {};

	/**
	 * The date of this score, represented in YYYYMMDD format.
	 * @property {String} scoreDate
	 */
	this.data.scoreDate = dateFormat(new Date(), "YYYYMMDD");

	/**
	 * The ID of the user doing the scoring.
	 * @property {Number} scorerID
	 */
	this.data.scorerID = scorerID;

	/**
	 * The ID of the user being scored.
	 * @property {Number} scoreeID
	 */
	this.data.scoreeID = scoreeID;

	// construct the score data to be persisted
	var categories = WSAPI.getScoreCategories();
	this.data.scoreData = "";
	for (var prop in scoreData) {
		var cat = categories.lookupCategory(prop);
		if (cat) {
		 	if (this.data.scoreData.length > 0) this.data.scoreData += ",";
		 	this.data.scoreData += cat.id + ":" + scoreData[prop];
		}
	}
}

ScoreRecord.prototype = new ChangeObject();
ScoreRecord.prototype.constructor = ScoreRecord;

// the score ID has the following format:
//		<scoreDate>-<scorerID>-<scoreeID>
ScoreRecord.prototype.getID = function() { 
	return this.data.scoreDate + "-" + this.data.scorerID + "-" + this.data.scoreeID;
}
