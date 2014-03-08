
/*
 * class for debugging 
 */
function Debug () {
}

// logs status messages with time in console.log
Debug.log = function (source, text) {
	var date = new Date();
	var string = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();
	for (var i = string.length; i < 15; i++)
		string += " ";
	string += " from " + source + ": " + text + "...";
	console.log(string);
}

Debug.log("Debug", "module loaded");
