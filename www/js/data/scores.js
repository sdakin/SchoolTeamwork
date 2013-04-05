/**
 * @Module DataModels
 */

/**
 * The in-memory representation of a score record for a given student in a
 * single class on a certain date. It contains sub-objects for the roles
 * that enter scores (teacher and student) and then the score values per
 * category.
 */
function ScoreData() {
	/**
	 * @property {Object} scores
	 */
	this.scores = {};
}


/**
 * A value object that handles all of the data for an individual score record.
 *
 * @class ScoreRecord
 * @extends ChangeObject
 * @constructor
 * @param {String} scorerID the ID of the user doing the scoring.
 * @param {String} scoreeID the ID of the user being scored.
 * @param {Number} classID the ID of the class being scored.
 * @param {Object} scoreData an object hash of score data `(<categoryName>: <scoreValue>)`.
 */
function ScoreRecord(scorerID, scoreeID, classID, scoreData) {
	ChangeObject.call(this);

	/**
	 * The ChangeObject data property - this is the object that gets sent to the ChangeManager.
	 * @property {Object} data
	 */
	this.data = {};

	/**
	 * The date of this score, represented in YYYYMMDD format.
	 * @property {String} data.scoreDate
	 */
	this.data.scoreDate = dateFormat(new Date(), "YYYYMMDD");

	/**
	 * The ID of the user doing the scoring.
	 * @property {Number} data.scorerID
	 */
	this.data.scorerID = scorerID;

	/**
	 * The ID of the user being scored.
	 * @property {Number} data.scoreeID
	 */
	this.data.scoreeID = scoreeID;

	/**
	 * The ID of the class being scored.
	 * @property {Number} data.classID
	 */
	this.data.classID = classID;

	/**
	 * The encoded score data with the format `"<categoryID>:<scoreValue>,..."`.
	 * @property {String} data.scoreData
	 */
	this.data.scoreData = "";

	// construct the score data to be persisted
	var categories = theSchoolApp.appData.scoreCategories;
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
