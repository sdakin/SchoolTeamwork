<?php

// Figure out what browser is used, its version and the platform it is running on.
//
// This code was ported in part from JQuery v1.3.1.
class Browser {
    public static function detect($userAgent = NULL) {
		if (!isset($userAgent))
	        $userAgent = strtolower($_SERVER['HTTP_USER_AGENT']); 

    	$props    = array("Version" => "0.0.0",
                                "Name" => "unknown",
                                "Agent" => "unknown",
                                "AllowsHeaderRedirect" => true) ;

        $browsers = array("msie", "chrome", "firefox", "mozilla", "safari",
                          "mobile safari", "opera", "seamonkey", "konqueror",
                          "netscape", "gecko", "navigator", "mosaic", "lynx",
                          "amaya", "omniweb", "avant", "camino", "flock", "aol");

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

?>
