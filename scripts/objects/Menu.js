Debug.log("Menu", "module loaded");

/*
 * class for menu and basic html
 */
function Menu() {
	Debug.log("Menu", "instance created");
}

// contains the dropdown dom object
Menu.prototype.dropDown;
// is the dropdown menu collapsed
Menu.prototype.folded = true;

// init 
Menu.prototype.init = function () {
	this.generateHTML();
}

// generates basic HTML and inserts it
Menu.prototype.generateHTML = function () {
	var container = document.createElement("div");
	container.id = "menuContainer";
	container.style.backgroundColor = "#19446b";
	container.style.position = "absolute";
	container.style.height = "25px";
	container.style.top = "0px";
	container.style.left = "0px";
	document.body.appendChild(container);

	var dropDown = document.createElement("div");
	dropDown.id = "menuDropDown";
	dropDown.style.width = "200px";
	dropDown.style.height = "25px";
	dropDown.style.position = "absolute";
	dropDown.style.top = "0px";
	dropDown.style.overflow = "hidden";
	dropDown.style.left = "0px";
	dropDown.style.backgroundColor = "#6395c4";
	container.appendChild(dropDown);
	this.dropDown = dropDown;
	
	var dropDownButton = document.createElement("div");
	dropDownButton.innerHTML = "Debug Settings";	
	dropDownButton.onclick = menu.fold;
	dropDownButton.style.backgroundColor = "#4d7ba5";
	dropDownButton.style.height = "25px";
	dropDown.appendChild(dropDownButton);

	var dropDownControls = document.createElement("div");
	dropDownControls.id = "dropdownControls";
	dropDownControls.style.position = "relative";
	dropDownControls.style.left = "0px";
	dropDown.appendChild(dropDownControls);

	var tmpDiv = document.createElement("div");
	var check = document.createElement("input");
	check.id = "displayDebug";
	check.type = "checkbox";
	tmpDiv.appendChild(check);
	tmpDiv.innerHTML += "display debug info";
	dropDownControls.appendChild(tmpDiv);
	document.getElementById("displayDebug").onclick = menu.debugCheck;

	tmpDiv = document.createElement("div");
	check = document.createElement("input");
	check.id = "displayPath";
	check.type = "checkbox";
	tmpDiv.appendChild(check);
	tmpDiv.innerHTML += "display path";
	dropDownControls.appendChild(tmpDiv);
	document.getElementById("displayPath").onclick = menu.pathCheck;

	tmpDiv = document.createElement("div");
	check = document.createElement("input");
	check.id = "displayDistance";
	check.type = "checkbox";
	tmpDiv.appendChild(check);
	tmpDiv.innerHTML += "display distance to bar";
	dropDownControls.appendChild(tmpDiv);
	document.getElementById("displayDistance").onclick = menu.distanceCheck;

	tmpDiv = document.createElement("div");
	check = document.createElement("input");
	check.id = "displayBar";
	check.type = "checkbox";
	tmpDiv.appendChild(check);
	tmpDiv.innerHTML += "display bar";
	dropDownControls.appendChild(tmpDiv);
	document.getElementById("displayBar").checked = false;
	document.getElementById("displayBar").onclick = menu.barCheck;

	tmpDiv = document.createElement("div");
	check = document.createElement("input");
	check.id = "displayDrunken";
	check.type = "checkbox";
	tmpDiv.appendChild(check);
	tmpDiv.innerHTML += "display drunken";
	dropDownControls.appendChild(tmpDiv);
	document.getElementById("displayDrunken").checked = false;
	document.getElementById("displayDrunken").onclick = menu.drunkenCheck;

	tmpDiv = document.createElement("div");
	check = document.createElement("input");
	check.id = "fastForward";
	check.type = "checkbox";
	tmpDiv.appendChild(check);
	tmpDiv.innerHTML += "fast forward simulation";
	dropDownControls.appendChild(tmpDiv);
	document.getElementById("fastForward").setAttribute("onclick", "menu.fastForward();");

	tmpDiv = document.createElement("div");
	tmpDiv.id = "fasterForwardDiv";
	check = document.createElement("input");
	check.id = "fasterForward";
	check.type = "checkbox";
	check.style.marginLeft = "20px";
	tmpDiv.appendChild(check);
	tmpDiv.style.display = "none";
	tmpDiv.innerHTML += "even faster";
	dropDownControls.appendChild(tmpDiv);
	document.getElementById("fasterForward").setAttribute("onclick", "menu.fastForward(1);");

	var reset = document.createElement("button");
	reset.innerHTML = "reset zoom and position";
	reset.style.position = "absolute";
	reset.style.left = "200px";
	reset.onclick = menu.reset;
	container.appendChild(reset);

	var debug = document.createElement("div");
	debug.id = "debugInfo";
	debug.style.backgroundColor = "#618bb2";
	debug.style.position = "absolute";
	debug.style.bottom = "0px";
	debug.style.right = "0px";
	debug.style.height = "100px";
	debug.style.width = "300px";
	debug.style.display = "none";
	document.body.appendChild(debug);

	Debug.log("Menu", "basic html inserted");
	this.updateStyle();
}

// refreshes values (for onresize)
Menu.prototype.updateStyle = function () {
	document.getElementById("menuContainer").style.width = window.innerWidth + "px";
}

// function for the "debug info" checkbox
Menu.prototype.debugCheck = function () {
	document.getElementById("debugInfo").style.display = document.getElementById("displayDebug").checked ? "block" : "none";
}

// function for the "display path" checkbox
Menu.prototype.pathCheck = function () {
	graphics.displayPaths = document.getElementById("displayPath").checked;
}

// function for the "display distance" checkbox
Menu.prototype.distanceCheck = function () {
	graphics.displayDistance = document.getElementById("displayDistance").checked;
}

// function for the "display bar" checkbox
Menu.prototype.barCheck = function () {
	graphics.displayBar = document.getElementById("displayBar").checked;
}

// function for the "display drunken" checkbox
Menu.prototype.drunkenCheck = function () {
	graphics.displayDrunken = document.getElementById("displayDrunken").checked;
}

// function for "fast forward simulation" and "even faster"
Menu.prototype.fastForward = function (faster) {
	if (faster) {
		if (fasterId) {
			// clear faster tick interval
			// and set normal tick to fast mode
			useTicksPerEdge = defTicksPerEdge;
			window.clearInterval(fasterId);			
			fasterId = 0;
			menu.fastForward();
			document.getElementById("fastForward").disabled = false;
		} else {		
			// set normal tick to normal mode
			// and set faster tick interval	
			useTicksPerEdge = defTicksPerEdge / 5;
			fasterId = window.setInterval(fastTick, 1);
			window.clearInterval(tickId);
			tickId = window.setInterval(tick, 1000 / numberOfTicksPerSec);
			document.getElementById("fastForward").disabled = true;
		}
		return;
	} 

	// if fast forward is checked switch normal tick to fast mode
	// and display "even faster" checkbox
	if (document.getElementById("fastForward").checked) {
		window.clearInterval(tickId);
		tickId = window.setInterval(tick, 10);
		document.getElementById("fasterForwardDiv").style.display = "block";
	// else switch normal tick to normal mode
	// and hide "ven faster" checkbox
	} else {
		window.clearInterval(tickId);
		tickId = window.setInterval(tick, 1000 / numberOfTicksPerSec);
		document.getElementById("fasterForwardDiv").style.display = "none";
	}
}

// function for the reset button
// resets zoom and centers null position
Menu.prototype.reset = function () {
	graphics.zoom = 1;
	graphics.null = new Position(window.innerWidth / 2, window.innerHeight / 2);
}

// function for the dropdown menu
// collaps the dropdown menu
Menu.prototype.fold = function () {
	if (menu.folded)
		menu.dropDown.style.height = "auto";		
	else
		menu.dropDown.style.height = "25px";
	menu.folded = !menu.folded;

	Debug.log("Menu", "dropdown menu is " + (menu.folded ? "closed" : "opened"));
}
