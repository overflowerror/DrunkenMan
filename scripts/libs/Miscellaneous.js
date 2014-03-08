Debug.log("Miscellaneous", "module loaded");

/*
 * calculates page loading time
 */
function calcLoadTime() {
    var startTime = new Date().getTime();
    window.setTimeout(function() {
        var endTime = new Date().getTime();
	var time = endTime - startTime;
        Miscellaneous.prototype.loadTime = time;
	Debug.log("Miscellaneous", "page loading time calculated: " + time + "ms");
    }, 0);
}
calcLoadTime();
// removes function
calcLoadTime = null;

// add static mathode sign to Math class
Math.sign = function(x) {
	return (x > 0) ? 1 : (x < 0) ? -1 : 0; 
}

/*
 * class for all functions, which don't fit into other classes
 */
function Miscellaneous () {
	Debug.log("Miscellaneous", "instance created");
}

// include function
// includes file and excecuts load once the file is fully loaded, parsed and useable 
Miscellaneous.prototype.include = function (file, load) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.onload = load;
	script.src = file;
	document.head.appendChild(script);
	Debug.log("Miscellaneous", "file included \"" + file + "\"");
}

// this function get's sopported style props
// used for css3 manipulation in javascript 
Miscellaneous.prototype.getsupportedprop = function (proparray) {
    var root = document.documentElement;
    for (var i = 0; i < proparray.length; i++)
        if (typeof root.style[proparray[i]] == "string")
            return proparray[i] 
}

