//---------------------------------
/**
 * Base class for all users of the TPS app.
 *
 * @class UserData
 * @extends EventTarget
 * @constructor
 */
function UserData(spec) {
	EventTarget.call(this);

	/**
	 * The unique ID of this user.
	 * @property {Number} id
	 */
	this.id;

	/**
	 * The username that is used to log in the user.
	 * @property {String} username
	 */
	this.username;
	/**
	 * The name of the user that is displayed in the app UI.
	 * @property {String} displayName
	 */
	this.displayName;
	
	if (spec)
		$.extend(this, spec);
	if (!this.hasOwnProperty("displayName"))
		this.displayName = this.firstName + " " + this.lastName;
}

UserData.prototype = new EventTarget();
UserData.prototype.constructor = UserData;

UserData.PARENT_ROLE = "parent";
UserData.STUDENT_ROLE = "student";
UserData.TEACHER_ROLE = "teacher";

UserData.PARENT_ROLE_NUM = 3;
UserData.STUDENT_ROLE_NUM = 2;
UserData.TEACHER_ROLE_NUM = 1;

/**
 * Accessor for retrieving the userID.
 * @return {Number} The userID.
 */
UserData.prototype.getUserID = function() { return this.id }


//---------------------------------
/**
 * Class for storing teacher-specific information.
 *
 * @class TeacherData
 * @extends UserData
 * @constructor
 */
function TeacherData(spec) {
	spec.role = UserData.TEACHER_ROLE;
	UserData.call(this, spec);

	// classes in an array of ClassData objects
	this.classes = [];
}

TeacherData.prototype = new UserData();
TeacherData.prototype.constructor = TeacherData;


//---------------------------------
/**
 * Class for storing parent-specific information.
 *
 * @class ParentData
 * @extends UserData
 * @constructor
 */
function ParentData(spec) {
	spec.role = UserData.PARENT_ROLE;
	UserData.call(this, spec);
}

ParentData.prototype = new UserData();
ParentData.prototype.constructor = ParentData;


//---------------------------------
/**
 * Class for storing student-specific information.
 *
 * @class StudentData
 * @extends UserData
 * @constructor
 * @param {Object} spec An object used to initialize the properties in
 *	this StudentData object and its parent class.
 */
function StudentData(spec) {
	spec.role = UserData.STUDENT_ROLE;
	UserData.call(this, spec);

	/**
	 * An object that holds the scores for this student, key: class, date and role,
	 * value: data. The data is a ScoreData object.
	 * @property {Object} scores
	 * @example
	 *     key:
	 *         < classID >
	 *             < date in YYYY-MM-DD format >
	 *                 student|teacher (role)
	 *     value:
	 *         ScoreData object
	 */
	this.scores = {};
}
StudentData.prototype = new UserData();
StudentData.prototype.constructor = StudentData;

/**
 * Triggered whenever a student data object changes.
 *
 * @event STUDENT_CHANGED
 * @param { name:String, slot:String }
 */
StudentData.STUDENT_CHANGED = "StudentChanged";

StudentData.prototype.getNote = function() {
	return this.note;
}

StudentData.prototype.getSelectedClass = function() {
	// TODO: need to support selecting classes
	return this.classes[0];
}

StudentData.prototype.getScore = function(role, category) {
	debugger;
	if (typeof this.scores[role] === "undefined")
		this.scores[role] = {};
	return this.scores[role][category];
}

StudentData.prototype.isScored = function() {
	// TODO: need to check for an existing score for the app's current date
	return this.status == "scored";
}

StudentData.prototype.setNote = function(newNote) {
	debugger;
	this.note = newNote;
	this.fire(StudentData.STUDENT_CHANGED);
}

StudentData.prototype.setScore = function(role, categoryID, scoreValue) {
	debugger;
	var classID = this.getSelectedClass().id;
	var dateStr = dateFormat("YYYY-MM-DD", theSchoolApp.appData.getCurrentDate());
	if (!this.scores[classID]) this.scores[classID] = {};
	if (!this.scores[classID][dateStr]) this.scores[classID][dateStr] = {};
	if (!this.scores[classID][dateStr][role]) this.scores[classID][dateStr][role] = {};
	var scoreData = this.scores[classID][dateStr][role];
	if (!scoreData) {
		scoreData = new ScoreData();
		this.scores[classID][dateStr][role] = scoreData;
	}
	scoreData.setScoreValue(categoryID, scoreValue);
}

StudentData.prototype.setStatus = function(newStatus) {
	this.status = newStatus;
	this.fire(StudentData.STUDENT_CHANGED);
}


/**
 * @class StudentList
 * @extends EventTarget
 */
function StudentList(spec) {
	EventTarget.call(this);
	
	$.extend(this, spec);

	/**
	 * The name of the class to which this student list corresponds.
	 * @property {String} name
	 */
	this.name;
	
	/**
	 * The time slot (period) of the class to which this student list corresponds.
	 * @property {String} slot
	 */
	this.slot;
	
	/**
	 * The array of StudentData objects that contains the data for all of the
	 * students in this list.
	 * @property {Array} students
	 */
	this.students;
	
	/**
	 * The object hash of the currently loaded scores for this student list.
	 * Keyed on studentID/date/categoryID with the value being the score or
	 * note if the categoryID is zero.
	 * @property {Object} scores
	 */
	this.scores;
	
	/**
	 * The index into the array of students of the current selected student.
	 * @property {Number} curStudentIndex
	 */
	this.curStudentIndex = (this.students && this.students.length > 0 ? 0 : -1);
}

StudentList.prototype = new EventTarget();
StudentList.prototype.constructor = StudentList;

// events fired by this object
StudentList.STUDENT_LIST_CHANGED = "StudentListChanged";

StudentList.prototype.atEnd = function() { return this.curStudentIndex >= this.getStudentCount() - 1 }
StudentList.prototype.atStart = function() { return this.curStudentIndex == 0 }

StudentList.prototype.getCurStudent = function() {
	if (this.curStudentIndex >= 0 && this.curStudentIndex < this.getStudentCount())
		return this.students[this.curStudentIndex];
	else
		return null;
}

StudentList.prototype.getCurStudentIndex = function() { return this.curStudentIndex; }
StudentList.prototype.setCurStudentIndex = function(newIndex) { this.curStudentIndex = newIndex; }
StudentList.prototype.getStudentCount = function() { return this.students ? this.students.length : 0; }

StudentList.prototype.nextStudent = function() {
	if (this.curStudentIndex < this.getStudentCount() - 1) {
		this.curStudentIndex++;
		this.fire(StudentList.STUDENT_LIST_CHANGED);
	}
}

StudentList.prototype.prevStudent = function() {
	if (this.curStudentIndex > 0) {
		this.curStudentIndex--;
		this.fire(StudentList.STUDENT_LIST_CHANGED);
	}
}