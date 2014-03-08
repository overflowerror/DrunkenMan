Debug.log("Bar", "module loaded");

/*
 * class for the bar
 */
function Bar () {
	Debug.log("Bar", "instance created");
	this.position = new Position();
	this.rotation = 0;
	this.image = new Image();
	this.image.src = "images/bar.png";
}

// image for graphics
Bar.prototype.image;
// rotaion for graphics
Bar.prototype.rotation;
// position
Bar.prototype.position;
