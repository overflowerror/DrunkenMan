Debug.log("Position", "module loaded");

/*
 * position class
 */
function Position(x, y) {
	// if arguments x, y are set
	if (x)	
		this.x = x;
	else
		this.x = 0;
	if (y)
		this.y = y;
	else 
		this.y = 0;
}

// yeah
Position.prototype.x;
Position.prototype.y;

// returns true if argument and this are the same position
Position.prototype.equals = function (position) {
	if (this.x == position.x && this.y == position.y)
		return true;
	return false;
}
