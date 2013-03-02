//-------------------------------------------------------
// StudentData object

StudentData.prototype = new EventTarget();
StudentData.prototype.constructor = StudentData;

// events fired by this object
StudentData.STUDENT_CHANGED = "StudentChanged";

function StudentData(spec) {
	EventTarget.call(this);
	
	// the scores object is indexed by: [future: class, date,] role and category
	this.scores = {};
	for (var prop in spec)
		this[prop] = spec[prop];
}

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


//-------------------------------------------------------
// StudentList object

StudentList.prototype = new EventTarget();
StudentList.prototype.constructor = StudentList;

// events fired by this object
StudentList.STUDENT_LIST_CHANGED = "StudentListChanged";

function StudentList(spec) {
	EventTarget.call(this);
	
	for (var prop in spec)
		this[prop] = spec[prop];
	this.curStudentIndex = (this.students && this.students.length > 0 ? 0 : -1);
}

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