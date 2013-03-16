<?php
	header("Cache-Control: max-age=0, must-revalidate");

	require_once 'ws/inc/analytics.php';
	require_once 'ws/inc/browser.php';
	
	$visitorID = startVisit("/apps/tps");
	$url = "school.html";
	$browser = Browser::detect();
	$version = (int)($browser['version']);
	logEvent($visitorID, 'Browser', $browser['name'], $version, 0, 1);
	if (isset($_SERVER['QUERY_STRING']) && strlen($_SERVER['QUERY_STRING']) > 0)
		$url .= "?" . $_SERVER['QUERY_STRING'];
	header('Location: ' . $url);
?>
