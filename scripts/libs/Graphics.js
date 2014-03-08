Debug.log("Graphics", "module loaded");

/*
 * class for graphic output
 */
function Graphics() {
	Debug.log("Graphics", "instance created");
	// some var init
	this.zoom = 1;
	this.displayPaths = false;
	this.displayDistance = false;
	this.displayBar = false;
	this.displayDrunken = false;
	this.drunken = new Drunken();
	this.bar = new Bar();
	this.null = new Position(window.innerWidth / 2, window.innerHeight / 2);
}

Graphics.prototype.canvas;		// contains the canvas element
Graphics.prototype.context;		// contains the context for drawing
Graphics.prototype.drunken;		// contains the drunken instance
Graphics.prototype.bar;			// contains the bar instance
Graphics.prototype.zoom;		// contains the current zoom factor
Graphics.prototype.null;		// contains the null position
Graphics.prototype.displayPaths;	// true, if the path should be drawn
Graphics.prototype.displayDistance;	// true, if the distance between bar and drunken should be drawn
Graphics.prototype.displayBar;		// true, if the graphical bar should be drawn
Graphics.prototype.displayDrunken;	// true, if the graphical drunken should be drawn

// init function
Graphics.prototype.init = function () {
	this.generateHTML();
}

// generates basic html
Graphics.prototype.generateHTML = function () {
	var container = document.createElement("div");
	container.id = "container";
	var canvas = document.createElement("canvas");
	canvas.id = "canvas";
	canvas.style.backgroundColor = "#becfdf";
	canvas.style.position = "absolute";
	canvas.style.top = "0px";
	canvas.style.left = "0px";
	canvas.style.cursor = "pointer";
	this.canvas = canvas;
	this.context = canvas.getContext('2d');
	container.appendChild(canvas);
	document.body.appendChild(container);
	Debug.log("Graphics", "basic html inserted");
	this.updateStyle();
}

// updates styles (called on resize)
Graphics.prototype.updateStyle = function () {
	this.canvas.height = window.innerHeight;
	this.canvas.width = window.innerWidth;
}

// draws all
Graphics.prototype.tick = function(path) {
	// draws background
	this.drawAlphaBackground();
	// moves canvas null position to null position
	this.context.translate(this.null.x, this.null.y);

	// display drunken
	if (this.displayDrunken)	
		this.drawDrunken(this.drunken);
	else 
		this.drawDrunkenPoint(this.drunken);

	// displays bar
	if (this.displayBar)	
		this.drawBar(this.bar);
	else
		this.drawBarPoint(this.bar);

	// displays path
	if (this.displayPaths)
		this.drawPath(path);
	
	// displays distance
	if (this.displayDistance)
		this.drawDistance();

	// moves canvas null position back to upper left corner
	this.context.translate(-this.null.x, -this.null.y);
}

// draws background
Graphics.prototype.drawAlphaBackground = function() {
	this.context.beginPath();
	this.context.fillStyle = "rgba(190, 207, 223, 1)";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.stroke();
}

// draws drunken graphical
Graphics.prototype.drawDrunken = function(drunken) {
	this.context.save();
	this.context.translate(this.zoom * drunken.position.x, this.zoom * drunken.position.y);
	var frameWidth = drunken.image.width / drunken.numberOfFrames;
	var frameHeight = drunken.image.height;
	var xOffset = frameWidth * drunken.step;
	this.context.rotate(drunken.rotation);
	this.context.drawImage(drunken.image, xOffset, 0, frameWidth, frameHeight, - frameWidth/ 2 * this.zoom, - frameHeight / 2 * this.zoom, this.zoom * frameWidth, this.zoom * frameHeight);
	this.context.stroke();
	this.context.restore();
}

// draws drunken
Graphics.prototype.drawDrunkenPoint = function (drunken) {
	this.context.beginPath();
	this.context.save();
	this.context.translate(this.zoom * drunken.position.x, this.zoom * drunken.position.y);
	this.context.strokeStyle = "#f00";
	this.context.arc(0, 0, drunken.step + 10, 0, Math.PI * 2, true);
	this.context.stroke();
	this.context.restore();
}

// draws bar graphical
Graphics.prototype.drawBar = function(bar) {
	this.context.save();
	this.context.translate(this.zoom * bar.position.x, this.zoom * bar.position.y);
	this.context.rotate(bar.rotation);
	this.context.drawImage(bar.image, 0, 0, bar.image.width, bar.image.height, - bar.image.width / 2 * this.zoom, - bar.image.height / 2 * this.zoom, this.zoom * bar.image.width, this.zoom * bar.image.height)
	this.context.stroke();
	this.context.restore();
}

// draws bar
Graphics.prototype.drawBarPoint = function (bar) {
	this.context.beginPath();
	this.context.save();
	this.context.translate(this.zoom * bar.position.x, this.zoom * bar.position.y);
	this.context.strokeStyle = "#00f";
	this.context.arc(0, 0, 15 - this.drunken.step, 0, Math.PI * 2, true);
	this.context.stroke();
	this.context.restore();
}

// default/begin image
Graphics.prototype.drawDefault = function () {
	// pointless at the moment
	// but maybe used in a later version
}

// draws path
Graphics.prototype.drawPath = function(path) {
	this.context.save();
	this.context.beginPath();
	this.context.lineCap = "round";
	this.context.strokeStyle = "#fff";
	var old = path.positions[0];
	for (var i = 1; i < path.positions.length; i++) {
		this.context.moveTo(old.x * this.zoom, old.y * this.zoom);
		var now = path.positions[i];
		this.context.lineTo(now.x * this.zoom, now.y * this.zoom);
		old = now;
	}
	this.context.stroke();
	this.context.restore();
}

// draws distance
Graphics.prototype.drawDistance = function () {
	this.context.save();
	this.context.beginPath();
	this.context.lineCap = "round";
	this.context.strokeStyle = "#f00";
	this.context.moveTo(0, 0);
	this.context.lineTo(this.drunken.position.x * this.zoom, this.drunken.position.y * this.zoom);
	this.context.stroke();
	this.context.restore();
}
