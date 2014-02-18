<?php

require_once "db.php";

function createVisitor() {
	$result = null;
	$pdo = dboConnect();
	date_default_timezone_set('America/Los_Angeles');
	$visitDate = date('Y-m-d H:i:s', time());
	
	// set up and execute the insert statement
	$insert = $pdo->prepare("INSERT INTO visitors SET remoteAddr=:remoteAddr, firstVisit=:firstVisit, lastVisit=:lastVisit");
	$params = array(':remoteAddr' => $_SERVER['REMOTE_ADDR'], ':firstVisit' => $visitDate, ':lastVisit' => $visitDate);
	$insert->execute($params);
	
	// return the ID of the inserted record
	if ($insert->rowCount() > 0)
		$result = $pdo->lastInsertId();
	
	return $result;
}

function registerReturnVisit($uid) {
	$pdo = dboConnect();
	date_default_timezone_set('America/Los_Angeles');
	$visitDate = date('Y-m-d H:i:s', time());
	
	// set up and execute the insert statement
	$update = $pdo->prepare("UPDATE visitors SET visitCount=visitCount+1, lastVisit=:lastVisit WHERE id = :uid");
	$params = array(':lastVisit' => $visitDate, ':uid' => $uid);
	$update->execute($params);
}

function startVisit() {
	$uid = $_COOKIE["uid"];
	if ($uid) {
		registerReturnVisit($uid);
	} else {
		$uid = createVisitor();
		if ($uid)
			setcookie("uid", $uid, time()+60*60*24*60, "/", $_SERVER['SERVER_NAME']);
	}
	return $uid;
}

class Browser { 
    /** 
        Figure out what browser is used, its version and the platform it is 
        running on. 

        The following code was ported in part from JQuery v1.3.1 
    */ 
    public static function detect($userAgent = NULL) {
		if (!isset($userAgent))
	        $userAgent = strtolower($_SERVER['HTTP_USER_AGENT']); 

    	$props    = array("Version" => "0.0.0",
                                "Name" => "unknown",
                                "Agent" => "unknown",
                                "AllowsHeaderRedirect" => true) ;

        $browsers = array("firefox", "msie", "opera", "chrome", "mobile safari", "safari",
                            "mozilla", "seamonkey",    "konqueror", "netscape",
                            "gecko", "navigator", "mosaic", "lynx", "amaya",
                            "omniweb", "avant", "camino", "flock", "aol");

        foreach($browsers as $browser)
        {
            if (preg_match("#($browser)[/ ]?([0-9.]*)#", $userAgent, $match))
            {
                $name = $match[1] ;
                $version = $match[2] ;
                break ;
            }
        }

        // Running on what platform? 
        if (preg_match('/linux/', $userAgent)) { 
            $platform = 'linux'; 
        } 
        elseif (preg_match('/macintosh|mac os x/', $userAgent)) { 
            $platform = 'mac'; 
        } 
        elseif (preg_match('/windows|win32/', $userAgent)) { 
            $platform = 'windows'; 
        } 
        else { 
            $platform = 'unrecognized'; 
        }

        return array( 
            'name'      => $name, 
            'version'   => $version, 
            'platform'  => $platform, 
            'userAgent' => $userAgent 
        ); 
    }
}

/**
 * Indents a flat JSON string to make it more human-readable.
 *
 * @param string $json The original JSON string to process.
 *
 * @return string Indented version of the original JSON string.
 *
 * http://recursive-design.com/blog/2008/03/11/format-json-with-php/
 */
function jsonPrettyPrint($json, $html = false) {

    $result      = '';
    $pos         = 0;
    $strLen      = strlen($json);
    $indentStr   = ($html ? "&nbsp;&nbsp;" : '  ');
    $newLine     = ($html ? "<br/>" : "\n");
    $prevChar    = '';
    $outOfQuotes = true;

    for ($i=0; $i<=$strLen; $i++) {

        // Grab the next character in the string.
        $char = substr($json, $i, 1);

        // Are we inside a quoted string?
        if ($char == '"' && $prevChar != '\\') {
            $outOfQuotes = !$outOfQuotes;
        
        // If this character is the end of an element, 
        // output a new line and indent the next line.
        } else if(($char == '}' || $char == ']') && $outOfQuotes) {
            $result .= $newLine;
            $pos --;
            for ($j=0; $j<$pos; $j++) {
                $result .= $indentStr;
            }
        }
        
        // Add the character to the result string.
        $result .= $char;

        // If the last character was the beginning of an element, 
        // output a new line and indent the next line.
        if (($char == ',' || $char == '{' || $char == '[') && $outOfQuotes) {
            $result .= $newLine;
            if ($char == '{' || $char == '[') {
                $pos ++;
            }
            
            for ($j = 0; $j < $pos; $j++) {
                $result .= $indentStr;
            }
        }
        
        $prevChar = $char;
    }

    return $result;
}

?>