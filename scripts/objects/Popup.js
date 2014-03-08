Debug.log("Popup", "module loaded");

/*
 * class for dialogs
 */
// contructor argument is title of popup
function Popup(title) {
	Debug.log("Popup", "'" + title + "': instance created");
	
	// some var init
	this.title = title;
	this.height = 400;
	this.width = 400;
	this.drag = false;
	this.id = Popup.getId();
	this.type = Popup.types.normal;
	Popup.add(this);
}

// static field with references to all popups
Popup.array = new Array();

// static array (enum) for popup types (not implemented)
Popup.types = {
	normal: 1,
	normalOkay: 2
}

// add popup to array
Popup.add = function (popup) {
	Popup.array.push(popup);
}

// get next id
Popup.getId = function () {
	return Popup.array.length;
}

// static function for handling drag
// called on mousemove
// argument is event object
Popup.checkDrag = function (e) {
	for(var i in Popup.array) {
		if (Popup.array[i].drag)
			Popup.array[i].move(e);
	}
}

// enables drag for popup id (argument)
// called on mousedown on title bar
Popup.enableDrag = function (id) {
	Debug.log("Popup", "id " + id + " drag enabled");
	Popup.array[id].drag = true;
	Popup.array[id].style.cursor = "move";
}

// diables drag for popup id (argument)
// called on mouseup on title bar
Popup.disableDrag = function (id) {
	Debug.log("Popup", "id " + id + " drag disabled");
	Popup.array[id].drag = false;
	Popup.array[id].dragedPosition = false;
	Popup.array[id].style.cursor = "pointer";
}

// closes popup id (argument)
Popup.close = function (id) {
	Popup.array[id].close();
}

// own id
Popup.prototype.id;
// popup title
Popup.prototype.title;
// popup inner text
Popup.prototype.text;
// popup type (not implemented)
Popup.prototype.type;
// popup height
Popup.prototype.height;
// popup width
Popup.prototype.width;
// contains reference to dom style
Popup.prototype.style;
// true, if drag is enabled
Popup.prototype.drag;
// contains last mouse position
Popup.prototype.dragedPosition;

// displays popup and generates html
Popup.prototype.display = function() {
	this.generateHTML();
	this.style.display = "block";
	Debug.log("Popup", "'" + this.title + "': opened");	
}

// generates html
Popup.prototype.generateHTML = function() {
	Debug.log("Popup", "'" + this.title + "': basic html inserted");
	var div = document.createElement("div");
	this.style = div.style;
	div.id = this.id;
	div.style.height = this.height + "px";
	div.style.width = this.width + "px";
	div.style.backgroundColor = "#dfe7ee";
	div.style.display = "none";
	div.style.position = "absolute";	
	div.style.top = (window.innerHeight / 2 - this.height / 2) + "px";
	div.style.left = (window.innerWidth / 2 - this.width / 2) + "px";
	div.style.cursor = "pointer";
	var taskbar = document.createElement("div");
	taskbar.className = "bar";
	taskbar.style.height = "20px";
	taskbar.style.width = this.width + "px";
	taskbar.style.backgroundColor = "#20588b";
	taskbar.style.position = "absolute";
	taskbar.style.top = 0;
	taskbar.style.left = 0;
	taskbar.innerHTML = '<span onclick="Popup.close(' + this.id + ');" onmouseover="this.style.color = \'#666\';" onmouseout="this.style.color = \'#111\';" style="cursor: pointer;">[x]</span> ' + this.title;
	div.appendChild(taskbar);
	var text = document.createElement("div");
	text.style.position = "absolute";
	text.style.top = "20px";
	text.innerHTML = this.text;
	div.appendChild(text);
	document.body.appendChild(div);

	var bar = document.getElementById(this.id + "").getElementsByClassName("bar")[0];
		
	// small hack for static function params
	bar.onmousedown = eval("(function () { Popup.enableDrag(" + this.id + ")})");
	bar.onmouseup   = eval("(function () { Popup.disableDrag(" + this.id + ")})");
}

// hiddes popup
Popup.prototype.close = function () {
	Debug.log("Popup", "'" + this.title + "': closed")
	this.style.display = "none";
}

// moves popup
// argument is event object
Popup.prototype.move = function (e) {
	var position = new Position(e.clientX, e.clientY);
	if (!this.dragedPosition) {
		this.dragedPosition = position;
		return;
	}
	var deltaX = position.x - this.dragedPosition.x;
	var deltaY = position.y - this.dragedPosition.y;
	this.style.top = (parseInt(this.style.top) + deltaY) + "px";
	this.style.left = (parseInt(this.style.left) + deltaX) + "px";
	this.dragedPosition = position;
}
