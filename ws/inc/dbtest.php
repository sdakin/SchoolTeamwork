<?php

require_once("db.php");
$conn = dboConnect();
if ($conn)
	echo "db test passed";
else
	echo "ERROR - db test failed: " . mysql_error();

?>
