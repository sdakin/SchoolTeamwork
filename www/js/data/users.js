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
	 * @property id
	 * @type Number
	 */
	this.id;
	
	if (spec)
		$.extend(this, spec);
	if (!this.hasOwnProperty("displayName"))
		this.displayName = this.username;
}

UserData.prototype = new EventTarget();
UserData.prototype.constructor = UserData;

UserData.PARENT_ROLE = "parent";
UserData.STUDENT_ROLE = "student";
UserData.TEACHER_ROLE = "teacher";

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
 */
function StudentData(spec) {
	spec.role = UserData.STUDENT_ROLE;
	UserData.call(this, spec);

	/**
	 * An object that holds the scores for this student,
	 * indexed by: [future: class, date,] role and category.
	 * @property scores
	 * @type Array
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

StudentData.prototype.getScore = function(role, category) {
	if (typeof this.scores[role] === "undefined")
		this.scores[role] = {};
	return this.scores[role][category];
}

StudentData.prototype.setNote = function(newNote) {
	this.note = newNote;
	this.fire(StudentData.STUDENT_CHANGED);
}

StudentData.prototype.setScore = function(role, category, scoreValue) {
	this.scores[role][category] = scoreValue;
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