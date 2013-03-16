// see: http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter
//
// ex:
//		var params = getQueryParams(document.location.search);
//		alert(params.foo);
//
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

function getBaseURL() {
	if (isSandbox())
		return "http://" + document.location.host + "/sandbox" + gAppPath;
	else
		return "http://" + document.location.host + gAppPath;
}

function isSandbox() {
	return (document.location.pathname.indexOf("sandbox") >= 0);
}

function isValidEmail(emailAddress) {
	if (emailAddress && emailAddress.length > 0) {
		// do a very rudimentary email validation
		var parts = emailAddress.split("@");
		if (parts.length == 2) {
			parts = parts[1].split(".");
			return (parts.length > 1 && parts[parts.length - 1].length >= 2);
		}
		return false;
	}
}

function consolelog(arg) {
	// ie console bug
	if (window.console) {
		console.log(arg);
	} 
}

function debugErrorAlert(errorString) {
	if (isSandbox()) {
		alert("DebugErrorAlert : " + errorString);
		consolelog("DebugErrorAlert : " + errorString);	
	}
}


function logEvent(visitorID, category, action, label, value, count, callback) {
	function handleLogEventResponse(json) {
		if (callback) {
			callback(json);
		}
	};
	
	if (typeof gaq !== "undefined") {
		var gLabel = "(" + visitorID + ") " + label;
		gaq.push(['_trackEvent', category, action, gLabel, value, count]);
	}

	var eventParams = {
			visitorID: visitorID,
			category: category,
			action: action,
			label: label,
			value: value,
			countVal: count
	   };
	$.post(
		getBaseURL() + "ws/logevent.php",
		{ 'data': $.toJSON(eventParams) },
		handleLogEventResponse,
		"json"
	).error(function() { 
		debugErrorAlert("logEvent error in $.post :" + eventParams.category + ":" + eventParams.label); 
		
		// still call the callback
		handleLogEventResponse( {} );
	});
}

// see: http://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript
function removeParameter(url, parameter)
{
  var urlparts= url.split('?');

  if (urlparts.length>=2)
  {
      var urlBase=urlparts.shift(); //get first part, and remove from array
      var queryString=urlparts.join("?"); //join it back up

      var prefix = encodeURIComponent(parameter)+'=';
      var pars = queryString.split(/[&;]/g);
      for (var i= pars.length; i-->0;)               //reverse iteration as may be destructive
          if (pars[i].lastIndexOf(prefix, 0)!==-1)   //idiom for string.startsWith
              pars.splice(i, 1);
      url = urlBase+'?'+pars.join('&');
  }
  return url;
}

// see: http://css-tricks.com/snippets/javascript/shuffle-array/
function shuffleArray(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

function range(start, count)
{
    if(arguments.length == 1) {
        count = start;
        start = 0;
    }

    var foo = [];
    for (var i = 0; i < count; i++)
        foo.push(start + i);
    return foo;
}

// see: http://stackoverflow.com/questions/280634/endswith-in-javascript
function strEndsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

if (typeof String.prototype.trim !== 'function') {
  // ie8 bug - String doesn't have trim
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

/**
* Format date as a string
* @param date - a date object (usually "new Date();")
* @param format - a string format, eg. "DD-MM-YYYY"
* @see http://stackoverflow.com/questions/1056728/formatting-a-date-in-javascript
*/
function dateFormat(date, format) {
    // Calculate date parts and replace instances in format string accordingly
    format = format.replace("DD", (date.getDate() < 10 ? '0' : '') + date.getDate()); // Pad with '0' if needed
    format = format.replace("MM", (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)); // Months are zero-based
    format = format.replace("YYYY", date.getFullYear());
    return format;
}


// Copyright (c) 2010 Nicholas C. Zakas. All rights reserved.
// MIT License
// http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/

function EventTarget(){
    this._listeners = {};
}

EventTarget.prototype = {

    constructor: EventTarget,

    addListener: function(type, listener){
        if (typeof this._listeners[type] == "undefined"){
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    },

    fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }

        if (this._listeners[event.type] instanceof Array){
            var listeners = this._listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, event);
            }
        }
    },

  	hasListener: function(type, listener) {
          if (this._listeners[type] instanceof Array){
              var listeners = this._listeners[type];
              for (var i=0, len=listeners.length; i < len; i++){
                  if (listeners[i] === listener){
                      return true;
                  }
              }
          }
  		return false;
  	},
	
    removeListener: function(type, listener){
        if (this._listeners[type] instanceof Array){
            var listeners = this._listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};
