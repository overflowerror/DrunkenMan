
/*
 * global vars 
 */
var lengthOfStep = 10;				// distance between edges; in graphical mode -> 40
var numberOfEdges = 10;				// will be set in start dialog
var defTicksPerEdge = 33;			// ticks for the drunken man to reach the next edge
var numberOfTicksPerSec = 33;			// sets tickrate (= framerate)

var useTicksPerEdge = defTicksPerEdge; 		// for "even faster"

var misc;					// contains the Miscellaneous instance
var graphics;					// contains the Graphics instance
var menu;					// contains the Menu instance
var path;					// contains the path for the drunken man

var edge;					// contains the active edge
var ticksPerEdge;				// contains the number of ticks to reach the next edge
var tickNum;					// contains the global number of ticks
var started;					// true, if simulation is started
var paused;					// true, if simulation end is reached

var checked;					// contains the number of loaded includes
var neededChecked;				// contains the number of includes

var dragEnabled;				// true, if canvas element is clicked
var dragInit;					// true, if initial position is not defined yet
var dragPosition;				// contains the last mouse position
var tickedDragPosition;				// contains activ mouse position

var tickId;					// contains the interval id of the main ticker
var fasterId;					// contains the interval if of the "even faster" ticker

var startpop;					// contains the startup dialog
var simTime;					// contains the simulation time

/*
 * setup routine
 */
function setup () {
	Debug.log("main", "setup routine started");

	// some var init...
	misc = new Miscellaneous();
	checked = 0;
	tickNum = 0;
	started = false;
	paused = false;
	edge = 0;
	ticksPerEdge = useTicksPerEdge;
	dragEnabled = false;
	dragInit = false;
	fasterId = 0;	
	simTime = 0;

	// includes for all modules

	neededChecked = 7;

	misc.include("scripts/libs/Graphics.js", check);
	misc.include("scripts/libs/Position.js", check);

	misc.include("scripts/objects/Path.js", check);
	misc.include("scripts/objects/Menu.js", check);
	misc.include("scripts/objects/Drunken.js", check);
	misc.include("scripts/objects/Bar.js", check);
	misc.include("scripts/objects/Popup.js", check);
}

/*
 * check routine for includes
 */
function check() {
	Debug.log("main", "load checked: " + ++checked + "/" + neededChecked);

	// if all modules are loaded execute main routine
	if (checked == neededChecked)
		main();
}

/*
 * main routine
 */
function main() {
	Debug.log("main", "main routine started");

	// some other var init
	graphics = new Graphics();
	menu = new Menu();
	path = new Path();	
	dragPosition = new Position();
	tickedDragPosition = new Position();

	// module init
	graphics.init();
	menu.init();

	// pointless, because there isn't a default image to draw ; )
	graphics.drawDefault();

	// set all (most) events
	setEvents();

	// generate startup dialog
	startpop = new Popup("Drunken Man Simulator");
	startpop.text = "";
	startpop.text += 'Options:<br />';
	startpop.text += '<input type="checkbox" id="graphical"></input>use graphical mode<br />';
	startpop.text += 'Please select a time: <br />';
	startpop.text += '<select size="1" onchange="selectOption(this);"><option disabled selected>select simulation time</option>';
	for (var i = 0; i < 4; i++) startpop.text += '<option value="' + (i ? (i * 5) : 1) + '">' + (i ? (i * 5) : 1) + ' minute' + (i ? "s" : "") + '</option>';
	startpop.text += '<option value="0">other</option>';
	startpop.text += '</select><br />';
	startpop.text += '<div style="display: none;" id="other"><input style="text-align: right;" type="text" value="20" id="val"></input><select size="1" id="siz"><option value="0">minutes</option><option value="1">edges</option></select><br /><input type="button" onclick="selectOther();" value="start simulation"></input></div>';
	startpop.display();
}

/*
 * sets all (most) events
 */
function setEvents() {
	window.onmousewheel = scroll;
	window.onmousemove = drag;
	document.getElementById("canvas").onmousedown = enableDrag;
	window.onmouseup = disableDrag;
	tickId = window.setInterval(tick, 1000 / numberOfTicksPerSec);
	window.setInterval(infoUpdate, 100);
	window.onresize = updateAllStyles;
}

/*
 * tick function for "even faster"
 */
function fastTick() {
	
	// if not started, than do nothing...
	if (!started) return;

	// if end not reached
	if (edge != numberOfEdges) {

		// calculate new Position and decrement current ticksPerEdge
		graphics.drunken.position = graphics.drunken.getNextPosition(path.positions[edge], ticksPerEdge--);

		// calculate rotation for graphical mode
		graphics.drunken.rotation = graphics.drunken.getNextRotation(path.positions[edge]);

		// if next edge is reached: increment edge number and reset ticksPerEdge
		if (graphics.drunken.position.equals(path.positions[edge])) {
			edge++;
			ticksPerEdge = useTicksPerEdge;
		}
	
		// calculate steps for animation
		graphics.drunken.step = graphics.drunken.frames[parseInt((tickNum / (5)) % graphics.drunken.frames.length)];
	}

	// if end reached stop simulation
	if (edge == numberOfEdges)
		stopSimulation();

	// increment tick counter
	tickNum++;
}

/*
 * normal tick function
 */
function tick() {

	// the same as fastTick
	if (!started) return;
	
	// if fast tick is disabled
	if ((edge != numberOfEdges) && (!fasterId)) {
		graphics.drunken.position = graphics.drunken.getNextPosition(path.positions[edge], ticksPerEdge--);
		graphics.drunken.rotation = graphics.drunken.getNextRotation(path.positions[edge]);
		if (graphics.drunken.position.equals(path.positions[edge])) {
			edge++;
			ticksPerEdge = useTicksPerEdge;
		}
		graphics.drunken.step = graphics.drunken.frames[parseInt((tickNum / (5)) % graphics.drunken.frames.length)];
	} 

	// drag routine for canvas element
	if (!dragPosition.equals(tickedDragPosition)) {
		if (!(dragInit)) {
			var deltaX = dragPosition.x - tickedDragPosition.x;
			var deltaY = dragPosition.y - tickedDragPosition.y;
			
			// sets null position in graphics 		
			graphics.null.x += deltaX;
			graphics.null.y += deltaY;				
		} else {
			dragInit = false;	
		}		
		tickedDragPosition.x = dragPosition.x;
		tickedDragPosition.y = dragPosition.y;
	}
	
	// update graphics
	graphics.tick(path);

	// if end is reached than stop simulation
	if (!paused && (edge == numberOfEdges))
		stopSimulation();
	if (!fasterId) 
		tickNum++;
}

/*
 * scroll function
 */
function scroll(e) {
	e = e ? e : window.event;
	var wheelData = e.detail ? e.detail : e.wheelDelta;
	if (wheelData > 0) 

		// on positiv scroll zoom in
		graphics.zoom *= 1.1;
	else 

		// on negativ scroll zomm out
		graphics.zoom /= 1.1;
}

/*
 * updates debug box
 */
function infoUpdate() {
	var text = "";
	text += "drunken: x=" + graphics.drunken.position.x + " y=" + graphics.drunken.position.y + " rot=" + graphics.drunken.rotation + "<br />";
	text += "bar: x=" + graphics.bar.position.x + " y=" + graphics.bar.position.y + " rot=" + graphics.bar.rotation + "<br />";
	text += "edges: " + edge + "/" + numberOfEdges + "<br />";
	document.getElementById("debugInfo").innerHTML = text;
}

/*
 * enables drag for canvas element
 */
function enableDrag (e) {
	dragEnabled = true;
	dragInit = true;
	document.getElementById("canvas").style.cursor = "move";
}

/*
 * disables drag for canvas element
 */
function disableDrag () {
	dragEnabled = false;
	document.getElementById("canvas").style.cursor = "pointer";
}

/*
 * drag function
 */
function drag (e) {
	
	// check drag on all popups
	Popup.checkDrag(e);

	// check drag for canvas element
	if (!dragEnabled)
		return;
	dragPosition.x = e.clientX;
	dragPosition.y = e.clientY;
}

/*
 * select function for start popup
 */
function selectOption (select, other) {
	switch(other) {
	case 1:
		// numberOfEdges = select
		Debug.log("main", (numberOfEdges = select) + " edges selected");
		break;
	case 0:
		var frames;
		// frames = select * numberOfTicksPerSec * 60; numberOfEdges = round(frames / defTicksPerEdge)
		// select in min
		Debug.log("main", select + " minutes selected -> " + (frames = select * numberOfTicksPerSec * 60) + " frames -> " + (numberOfEdges = Math.round(frames / defTicksPerEdge)) + " edges");
		simTime = frames / numberOfTicksPerSec;
		break;

	// on other == undefined
	default:
		var frames;
		// if value == 0 -> display other block
		if (select.value == 0) {
			document.getElementById("other").style.display = "block";
			return;
		}
		// same as case 1, but select is object
		// select.value in min
		Debug.log("main", select.value + " minutes selected -> " + (frames = select.value * numberOfTicksPerSec * 60) + " frames -> " + (numberOfEdges = Math.round(frames / defTicksPerEdge)) + " edges");
		simTime = frames / numberOfTicksPerSec;
	}
	
	// if graphical mode, then displayBar, displayDrunken, lengthOfStep = 40
	if (document.getElementById("graphical").checked) {
		lengthOfStep = 40;
		graphics.displayBar = true;
		graphics.displayDrunken = true;
		document.getElementById("displayBar").checked = true;
		document.getElementById("displayDrunken").checked = true;
	}

	// calculate new path
	path = new Path();
	path.calculate(0, 0, numberOfEdges - 1);
	
	// close popup
	startpop.close();
	
	// start simulation
	started = true;
}

/*
 * for the "start simulation" button
 */
function selectOther () {
	selectOption(parseInt(document.getElementById("val").value), parseInt(document.getElementById("siz").value));
}

/*
 * on resize update all styles
 */
function updateAllStyles () {
	graphics.updateStyle();
	menu.updateStyle();
}

/*
 * is called when simulation end is reached
 */
function stopSimulation() {
	paused = true;

	// reset all ticks
	if (fasterId) {
		window.clearInterval(fasterId);
		fasterId = 0;
	} else {
		window.clearInterval(tickId);
		tickId = window.setInterval(tick, 1000 / numberOfTicksPerSec);
	}
	
	// yeah, what do you think?
	generateEndPopup();
}

/*
 * generate the popup for the end
 */
function generateEndPopup () {
	var endPop = new Popup("simulation report");
	endPop.text = "";
	// if simulation time is set -> display time & frames
	if (simTime) {
		endPop.text += "simulation time: " + simTime + "s<br />";
		endPop.text += "frames: " + simTime * numberOfTicksPerSec + " (@ " + numberOfTicksPerSec + " fps)<br />";
	}
	endPop.text += "edges: " + numberOfEdges + "<br />";
	endPop.text += "distance: " + Math.sqrt(graphics.drunken.position.x * graphics.drunken.position.x + graphics.drunken.position.y * graphics.drunken.position.y) + "<br />";
	// calculated distance is the sqrt of time (einstein)
	endPop.text += "calculated distance: " + Math.sqrt(path.positions.length);
	endPop.display();
}
