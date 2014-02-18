<?php
echo $_SERVER['SERVER_NAME'] . '<br/>';
echo "attempting connection to db...<br/>";

require '../inc/db.php';
$pdo = dboConnect();
echo "connection attempt " . ($pdo ? "succeeded" : "failed") . '<br/>';

/*
require '../inc/util.php';
$result = createVisitor();
echo "createVisitor() call " . ($result ? "succeeded" : "failed") . '<br/>';
*/

$obj->visID = "26";
$obj->username = "a@b.com";
$json = json_encode($obj);
echo "JSON encode test: " . $json . "<br/>";
$decObj = json_decode('{"visID":"30","username":"a@b.com"}');
echo "JSON decode test: " . print_r($decObj, true);
?>
