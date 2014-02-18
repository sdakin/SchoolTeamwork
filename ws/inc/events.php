<?php

require_once 'db.php';

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