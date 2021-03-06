/**
 * The main module for the Team Player Score application. This module manages
 * all of the other submodules in the application.
 *
 * @class SchoolModule
 * @extends EventTarget
 * @constructor
 */
function SchoolModule() {
	EventTarget.call(this);

	/**
	 * An object hash of application modules.
	 * @property {Object} modules
	 */
	this.modules = {};

	/**
	 * The application data object.
	 * @property {AppData} appData
	 */
	this.appData = new AppData();

	var self = this;

	// load the class module, followed by the teacher module
	$('#class-panel').load('class.html', function() {
		var classModule = new ClassModule();
		self.modules["class"] = classModule;
		classModule.addListener(SchoolModule.UPDATE_CLASS_UI, onUpdateClassUI);
		classModule.addListener(ClassModule.CLASS_SELECTED, onClassSelected);
		classModule.addListener(ClassModule.SCORE_STUDENT, onTeacherScoreStudent);
		
		$('#teacher-panel').load('teacher.html', function() {
			var teacherModule = new TeacherModule();
			self.modules["teacher"] = teacherModule;
			teacherModule.addListener(TeacherModule.TEACHER_SCORE_BACK, onTeacherScoreBack);
			teacherModule.addListener(TeacherModule.TEACHER_STUDENT_SCORED, onTeacherStudentScored);
		});
	});
	
	$('#student-panel').load('student.html', function() {
		var studentModule = new StudentModule();
		self.modules["student"] = studentModule;
		studentModule.addListener(SchoolModule.UPDATE_CLASS_UI, onUpdateClassUI);
		studentModule.addListener(StudentModule.STUDENT_SCORED, onStudentScored);
	});
	
	$('#parent-panel').load('parent.html', function() {
		var newModule = new ParentModule();
		self.modules["parent"] = newModule;
	});
	
	$("#inputLogin").bind('textchange', function (event, previousText) { setupLoginUI() });
	$("#inputLogin").keyup(function(e) { if (e.keyCode === 13) { $("#inputPassword").focus(); } });
	$("#inputPassword").bind('textchange', function (event, previousText) { setupLoginUI() });
	$("#inputPassword").keyup(function(e) { if (e.keyCode === 13) { doLogin(); } });
	$("#login-panel .login-btn").click(doLogin);
	$("#header .close-box").click(doLogout);
	switchToPanel($('#login-panel'));
	setupLoginUI();

	function switchToPanel($panel) {
		$(".app-panel").hide();
		$panel.show();
	}
	
	function setupLoginUI() {
		if ($("#inputLogin").val().length > 0 && $("#inputPassword").val().length > 0)
			$("#login-panel .login-btn").removeAttr("disabled");
		else
			$("#login-panel .login-btn").attr("disabled", "disabled");
		if ($("#inputLogin").val().length == 0 && $("#inputPassword").val().length == 0)
			$("#inputLogin").focus();
	}

	function doLogin() {
		var $loginBtn = $("#login-panel .login-btn");
		var $alert = $("#login-panel .alert");
		if ($loginBtn.attr("disabled") != "disabled") {
			$alert.hide();
			$loginBtn.attr("disabled", "disabled");
			var login = $("#inputLogin").val().toLowerCase();
			var password = $("#inputPassword").val();
			WSAPI.login(login, password)
			.done(function(user) {
				if (user) {
					var loginScope = angular.element($("#login-panel")[0]).scope();
					loginScope.$apply(function(scope) {
						scope.doLogin(user);
					});
					switch(user.role) {
						case UserData.TEACHER_ROLE:
							// TODO: fetch the teacher's classes and load the first one by ID
							self.modules["class"].loadClass(0);
							break;
						case UserData.STUDENT_ROLE:
							self.modules["student"].loadStudent(user);
							break;
					}
				}
			})
			.fail(function() {
				$alert.text("Login failed.");
				$alert.show();
			})
			.always(function() {
				$loginBtn.removeAttr("disabled");
			})
		}
	}

	function doLogout() {
		$("#header .session-info").hide();
		$("#inputLogin").val("");
		$("#inputPassword").val("");
		switchToPanel($('#login-panel'));
		setupLoginUI();
	}
	
	function onClassSelected(e) {
		onUpdateClassUI({className:e.classData.name, classSlot:e.classData.slot});
		self.modules["teacher"].setStudentList(e.classData);
	}
	
	function onTeacherScoreBack(e) {
		switchToPanel($('#class-panel'));
	}
	
	function onTeacherScoreNext(e) {
		var cMod = self.modules["class"];
		if (cMod.selectedClass && cMod.selectedClass.students) {
			var index = $.inArray(cMod.selectedStudent, cMod.selectedClass.students);
			if (index >= 0 && index < cMod.selectedClass.students.length - 1) {
				var student = cMod.selectedClass.students[index + 1];
				cMod.selectStudent(student);
				self.modules["teacher"].scoreStudent(student, index >= cMod.selectedClass.students.length - 2);
			}
		}
	}
	
	function onTeacherScoreStudent(e) {
		self.modules["teacher"].scoreStudent(e.student);
		switchToPanel($('#teacher-panel'));
	}
	
	function onStudentScored(e) {
		saveScores(e.student, e.student.scores.student);
	}

	function onTeacherStudentScored(e) {
		saveScores(e.student, e.student.scores.teacher);
	}

	function saveScores(studentData, scoreData) {
		var scoreeID = studentData.getUserID();
		if (scoreeID) {
			var classInfo = studentData.getSelectedClass();
			var appScope = angular.element($(".app-frame")[0]).scope();
			appScope.$apply(function(scope) {
				scope.scoreUser(scoreeID, classInfo.id, scoreData);
			});
			studentData.setStatus("scored");
		}
		else
			console.log("*** No student ID for student:" + studentData.name);
	}
	
	function onUpdateClassUI(e) {
		var headerScope = angular.element($("#header")[0]).scope();
		headerScope.$apply(function(scope) {
			scope.classInfo.name = e.className;
			scope.classInfo.slot = e.classSlot;
		});
	}
};

SchoolModule.prototype = new EventTarget();
SchoolModule.prototype.constructor = SchoolModule;

/**
 * @event UPDATE_CLASS_UI
 * @param {Object} data `{name:String, slot:String}`
 */
SchoolModule.UPDATE_CLASS_UI = "UpdateClassUI";	// { name:String, slot:String }
