Debug.log("Path", "module loaded");

/*
 * class for paths
 */
function Path() {
	this.positions = new Array();
	Debug.log("Path", "instance created");
}

// contains edge array
Path.prototype.positions;

// calculates new edges and adds them to positions
// params: x, y   -> start point
//         length -> number of random points to add
Path.prototype.calculate = function (x, y, length) {
	var position = new Position(x, y);
	this.positions.push(position);
	for (var i = 0; i < length; i++) {
		position = this.getNext(position);
		this.positions.push(position);
	}
	Debug.log("Path", "new path calculated");
}

// calculates next point
Path.prototype.getNext = function (oldPosition) {
	var rotation = Math.random() * 2 * Math.PI;
	var result = new Position();
	result.x = parseInt(Math.cos(rotation) * lengthOfStep + oldPosition.x);
	result.y = parseInt(Math.sin(rotation) * lengthOfStep + oldPosition.y);
	return result; 
}
