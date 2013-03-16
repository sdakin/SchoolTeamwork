/**
 * The Web Service API module.
 *
 * @module WSAPI
 */

 /**
  * The Web Service API wrapper class. The WSAPI methods are accessed
  * via this class as top-level (not prototype) properties.
  *
  * @class WSAPI
  * @constructor
  */
 function WSAPI() {
 }


/**
 * Dummy login handler (will eventually be backed by a server-based API)
 *
 * @method login
 * @param {String} username the username of the user to log in 
 * @param {String} password the password of the user to log in
 * @return {Deferred} deferred object to track completion of the login operation.
 *					  The done() handler will be passed a UserData object of the
 *					  logged in user. If the user could not be logged in the done
 *					  handler will be passed a null object.
 *
 * @TODO: some of the data in this function is statically defined and needs to
 *		  be replaced with dynamic web service calls.
 */
WSAPI.login = function(username, password) {
	var promise = $.Deferred();
	var userInfo = {username: username};
	var newUser = null;
	switch (username) {
		case "annie":
			userInfo.displayName = "Annabelle Vince";
			userInfo.studentID = 1;
			newUser = new StudentData(userInfo);
			newUser.classes = [{name:"Pre-algebra", slot:"2nd Period"}];
			break;
		case "max":
			userInfo.displayName = "Maxwell Vince";
			newUser = new ParentData(userInfo);
			break;
		case "david":
			userInfo.displayName = "DK Sweet";
			newUser = new TeacherData(userInfo);
			break;
		default:
			promise.resolve(null);
			break;
	}
	promise.resolve(newUser);

	return promise;
}

/**
 * Returns an array of category objects to be scored.
 *
 * @method getScoreCategories
 * @return {Array} the categories to be scored - format: {name: <category name>, id: <category ID>}.
 */
WSAPI.getScoreCategories = function() {
	return [
		{name:"Creativity", id:1},
		{name:"Collaboration", id:2},
		{name:"Likeability", id:3},
		{name:"Empathy", id:4},
		{name:"Leadership", id:5}
	];
}
