<?php

require "inc/dbobj.php";

// destroy any lingering session
if (session_id())
	session_destroy();

$input = file_get_contents("php://input");
$loginData = json_decode($input);

$response->result = 401;
if (isset($loginData->username) && isset($loginData->password)) {
	$dbObj = new DBObject($loginData);
	$dbo = new DBManager("users");
	$userObj = $dbo->readObjects($dbObj);
	if ($userObj) {
		$response->result = 200;
		unset($userObj["password"]);
		$response->userInfo = $userObj;

		// start up a new session and cache the logged in user ID
		session_start();
		$_SESSION = array();
		session_regenerate_id(true);
		$_SESSION["userid"] = $userObj["id"];
	}
} else
	$response->result = 403;

echo json_encode($response);

?>
