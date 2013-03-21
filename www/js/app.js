/**
 * The ScoreManager extends the ChangeManger class and handles
 * score-specific change functionality for the Team Player Score app.
 *
 * @class ScoreManager
 * @extends ChangeManager
 * @constructor
 */
function ScoreManager() {
	ChangeManager.call(this);
}

ScoreManager.prototype = new ChangeManager();
ScoreManager.prototype.constructor = ScoreManager;

ScoreManager.prototype.sendChanges = function(changes, pendingCount) {
	var scores = [];
	$.each(changes, function(index, changeObj) {
		var scoreData = $.extend({}, changeObj.data, {id:changeObj.getID()});
		scores.push(scoreData);
	})
	console.log(JSON.stringify(scores));
	$.post("ws/saveScores.php", JSON.stringify(scores))
	.done(function(response) {
		console.log("saved score - response: " + response);
	})
	.fail(function() { alert("error"); });
}


/**
 * An Angular Controller responsible for handling the primary
 * functions of the Team Player Score application.
 *
 * @class AppCtrl
 * @constructor
 */
function AppCtrl($scope) {
	$scope.user = {};
	$scope.classInfo = {};

	/**
	 * The object responsible for persisting score data.
	 * @property {ScoreManager} scoreManager
	 */
	$scope.scoreManager = new ScoreManager();

	$scope.doLogin = function(user) {
		$scope.user = user;
		$scope.classInfo = {};
		$panel = null;
		switch (user.role) {
			case UserData.STUDENT_ROLE: $panel = $('#student-panel'); break;
			case UserData.PARENT_ROLE: 	$panel = $('#parent-panel'); break;
			case UserData.TEACHER_ROLE: $panel = $('#class-panel'); break;
		}
		if ($panel)
			$scope.showPanel($panel);
		else
			console.error("unable to determine panel from user");
		$("#header .session-info").show();
		logEvent($.cookie('uid'), "navigation", "login", $scope.user.username);
	};

	$scope.scoreUser = function(scoreeID, scoreData) {
		// construct a ScoreRecord and add it to the change queue
		var scoreData = new ScoreRecord($scope.user.getUserID(), scoreeID, scoreData);
		$scope.scoreManager.addChange(scoreData);
	}

	$scope.showPanel = function($panel) {
		$(".app-panel").hide();
		$panel.show();
	}
}

var gAppPath = "/apps/tps/";
var theSchoolApp;

$(function() {
	theSchoolApp = new SchoolModule();
});

