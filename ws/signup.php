<?php

header("Cache-Control: max-age=0, must-revalidate");

require 'inc/dbobj.php';

$response->result = 200;
$input = (get_magic_quotes_gpc() ? stripslashes($_POST["data"]) : $_POST["data"]);
$signupInfo = json_decode($input);

$db = new DBManager("users");
$dbObj = new DBObject($signupInfo);
if (!$db->objectExists($dbObj, "username")) {
	date_default_timezone_set('America/Los_Angeles');
	$dbObj->data->signupDate = date('Y-m-d H:i:s', time());
}

$response->saveResult = $db->saveObject($dbObj, "username");

echo json_encode($response);

?>
