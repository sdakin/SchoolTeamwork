<?php

require_once "db.php";

function createVisitor() {
	$result = null;
	$pdo = dboConnect();
	date_default_timezone_set('America/Los_Angeles');
	$visitDate = date('Y-m-d H:i:s', time());
	
	// set up and execute the insert statement
	$insert = $pdo->prepare("INSERT INTO visitors SET remoteAddr=:remoteAddr, firstVisit=:firstVisit, lastVisit=:lastVisit");
	$params = array(':remoteAddr' => $_SERVER['REMOTE_ADDR'], ':firstVisit' => $visitDate, ':lastVisit' => $visitDate);
	$insert->execute($params);
	
	// return the ID of the inserted record
	if ($insert->rowCount() > 0)
		$result = $pdo->lastInsertId();
	
	return $result;
}

function registerReturnVisit($uid) {
	$pdo = dboConnect();
	date_default_timezone_set('America/Los_Angeles');
	$visitDate = date('Y-m-d H:i:s', time());
	
	// set up and execute the insert statement
	$update = $pdo->prepare("UPDATE visitors SET visitCount=visitCount+1, lastVisit=:lastVisit WHERE id = :uid");
	$params = array(':lastVisit' => $visitDate, ':uid' => $uid);
	$update->execute($params);
}

function startVisit($path) {
	if (!isset($path)) $path = "/";
	$uid = $_COOKIE["uid"];
	if ($uid) {
		registerReturnVisit($uid);
	} else {
		$uid = createVisitor();
		if ($uid)
			setcookie("uid", $uid, time()+60*60*24*60, $path, $_SERVER['SERVER_NAME']);
	}
	return $uid;
}

function logEvent($visitorID, $category, $action, $label = "", $value = 0, $count = 1) {
	$pdo = dboConnect();
	date_default_timezone_set('America/Los_Angeles');
	$eventDate = date('Y-m-d H:i:s', time());
	
	// set up and execute the insert statement
	$query = "INSERT INTO events SET visitorID=:visitorid, timestamp=:timestamp, category=:category, " .
									"action=:action, label=:label, value=:value, count=:count";
	$params = array(':visitorid' => $visitorID, ':timestamp' => $eventDate, ':category' => $category, 
					':action' => $action, ':label' => $label, ':value' => $value, ':count' => $count);
	$insert = $pdo->prepare($query);
	$insert->execute($params);
	
	$rowID = "??";
	if ($insert->rowCount() > 0)
		$rowID = $pdo->lastInsertId();
	return $rowID;
}

?>
