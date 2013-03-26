<?php

//session_start();

// TODO: check to make sure the session has been authenticated
//if (!isset($_SESSION["userid"])) {
//	header("HTTP/1.1 401 Unauthorized");
//	echo "<html><body><h3>401 Unauthorized</h3></body></html>";
//	die;
//}

require 'inc/db.php';

header("Cache-Control: max-age=0, must-revalidate");

$response->result = 500;

// TODO: set the userid from the session
//$userid = $_SESSION["userid"];
$userid = 1;

$pdo = dboConnect();
// TODO: support querying for scores by date range
$query = $pdo->prepare("SELECT * FROM scores " .
					   "WHERE userID=:userID ORDER BY scoreDate");
$params = array(':userID' => $userid);
$query->execute($params);
while ($row = $query->fetch(PDO::FETCH_ASSOC))
	$response->scores[] = $row;
$response->result = 200;

echo json_encode($response);

?>
