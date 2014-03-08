Debug.log("Drunken", "module loaded");

/*
 * class for the drunken man 
 */
function Drunken () {
	Debug.log("Drunken", "instance created");
	// some var init
	this.step = 1;
	this.position = new Position();
	this.rotation = 0;
	this.image = new Image();
	this.image.src = "images/drunken.gif";
	this.numberOfFrames = 8;

	// definition of the frames (order)
	this.frames = Array();
	this.frames[0] = 4;
	this.frames[1] = 3;
	this.frames[2] = 2;
	this.frames[3] = 1;
	this.frames[4] = 0;
	this.frames[5] = 1;
	this.frames[6] = 2;
	this.frames[7] = 3;
	this.frames[8] = 4;
	this.frames[9] = 5;
}

// rotation for graphics
Drunken.prototype.rotation;
// position 
Drunken.prototype.position;
// current animation step
Drunken.prototype.step;
// how many frames does the animation have?
Drunken.prototype.numberOfFrames;
// array for the frame order
Drunken.prototype.frames;

// calculates new position and returns it
Drunken.prototype.getNextPosition = function(nextEdge, ticksToNext) {
	/* safty first */
	if (ticksToNext < 0) {
		this.position = nextEdge;
		return this.position;
	}

	// split distance to x,y
	var deltaX = nextEdge.x - this.position.x;
	var deltaY = nextEdge.y - this.position.y;
	// calulate step width for next tick
	var xPerTick = deltaX / ticksToNext;
	var yPerTick = deltaY / ticksToNext;
	// create new position instance with new coordinates 
	return new Position(xPerTick + this.position.x, yPerTick + this.position.y);
}

// calculates new rotation and returns it
Drunken.prototype.getNextRotation = function(nextEdge) {
	var deltaX = nextEdge.x - this.position.x;
	var deltaY = nextEdge.y - this.position.y;
	var direct = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	if (direct == 0)
		var rot = 0;
	else
		var rot = Math.acos(deltaX / direct) * Math.sign(deltaY) - Math.PI / 2;
	return rot;
}
