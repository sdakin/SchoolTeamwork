<?php

header("Cache-Control: max-age=0, must-revalidate");
session_start();

$response->result = 500;

// check to make sure the session has been authenticated
if (isset($_SESSION["userid"])) {
	require 'inc/db.php';

	// set the userid from the session
	$userid = $_SESSION["userid"];
	$pdo = dboConnect();
	// TODO: support querying for scores by date range
	$query = $pdo->prepare("SELECT * FROM scores " .
						   "WHERE scorerID=:userID ORDER BY scoreDate");
	$params = array(':userID' => $userid);
	$query->execute($params);
	while ($row = $query->fetch(PDO::FETCH_ASSOC))
		$response->scores[] = $row;
	$response->result = 200;
} else {
	$response->result = 403;
}

echo json_encode($response);

?>
