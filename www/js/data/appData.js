/**
 * The main application data object. Stores information that
 * is used by modules throughout the application.
 *
 * @class AppData
 * @extends EventTarget
 */
function AppData() {
	EventTarget.call(this);

	/**
	 * The current date used in the application.
	 * @property {Date} currentDate
	 */
	this.currentDate = new Date();
}

AppData.prototype = new EventTarget();
AppData.prototype.constructor = AppData;

AppData.CURRENT_DATE_CHANGED = "CurrentDateChanged";

/**
 * Accessor for the current date.
 *
 * @function getCurrentDate
 * @return {Date} the current date.
 */
AppData.prototype.getCurrentDate = function() { return this.currentDate }

AppData.prototype.adjustDate = function(offset) {
	var daysInMillis = (1000 * 60 * 60 * 24);
	this.currentDate.setTime(this.currentDate.getTime() + (daysInMillis * offset));
	this.fire({type:AppData.CURRENT_DATE_CHANGED, date:this.currentDate});
}
