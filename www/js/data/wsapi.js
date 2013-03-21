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
 * A helper class to manage the collection of categories used in the
 * Team Player Score app.
 *
 * @class CategoryCollection
 * @constructor
 */
function CategoryCollection() {
	this.categories = [
		{name:"Creativity", id:1},
		{name:"Collaboration", id:2},
		{name:"Likeability", id:3},
		{name:"Empathy", id:4},
		{name:"Leadership", id:5}
	];
}

/**
 * Searches the CategoryCollection for a category with a name matching
 * the search category.
 *
 * @method lookupCategory
 * @param {String} searchCategory the category to search the collection for.
 * @return {Object} a category object `{name: <name>, id: <id>}` or null if
 * 					none is found.
 */
CategoryCollection.prototype.lookupCategory = function(searchCategory) {
	var result = null;
	searchCategory = searchCategory.toLowerCase();
	for (var i = this.categories.length - 1 ; i >= 0 ; i--) {
		if (searchCategory == this.categories[i].name.toLowerCase()) {
			result = this.categories[i];
			break;
		}
	}
	return result;
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
			userInfo.id = 2;
			userInfo.displayName = "Annabelle Vince";
			newUser = new StudentData(userInfo);
			newUser.classes = [{name:"Pre-algebra", slot:"2nd Period"}];
			break;
		case "max":
			userInfo.id = 3;
			userInfo.displayName = "Maxwell Vince";
			newUser = new ParentData(userInfo);
			break;
		case "david":
			userInfo.id = 1;
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
	return new CategoryCollection();
}
