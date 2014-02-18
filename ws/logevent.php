<?php

header("Cache-Control: max-age=0, must-revalidate");

require 'inc/events.php';

$input = (get_magic_quotes_gpc() ? stripslashes($_POST["data"]) : $_POST["data"]);
$eventData = json_decode($input);
if (isset($eventData->visitorID) && $eventData->visitorID)
	$visitorID = $eventData->visitorID;
else
	$visitorID = $_COOKIE['uid'];
$response->eventID = logEvent($visitorID, $eventData->category, $eventData->action, 
							  $eventData->label, $eventData->value, $eventData->countVal);
$response->result = 200;

echo json_encode($response);

?>
