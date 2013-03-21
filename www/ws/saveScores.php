<?php

require "inc/dbobj.php";

$input = file_get_contents("php://input");
$scoreData = json_decode($input);

$dbo = new DBManager("scores");
$keyCols = array('scoreDate', 'scorerID', 'scoreeID');
$result = null;
if (is_array($scoreData)) {
	$result = array();
	foreach ($scoreData as $value) {
		$obj = new DBObject($value);
		$result[] = $dbo->saveObject($obj, $keyCols);
	}
} else {
	$obj = new DBObject($scoreData);
	$result = $dbo->saveObject($obj, $keyCols);
}

echo json_encode($result);

?>
