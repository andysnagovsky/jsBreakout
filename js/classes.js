function Keyboard(){
    this.key = {
        37: 'left',
        39: 'right',
		32: 'space',
		13: 'enter'
    }
	this.pressed = {
		'left' : false,
		'right': false,
		'space': false,
		'enter': false
	}
    this.isPressed = function(keyName){
		return this.pressed[keyName];
    }
	this.setPressed = function(keyName){
		this.pressed[keyName] = true;
	}
	this.setReleased = function(keyName){
		this.pressed[keyName] = false;
	}
}
function Mouse(){
	this.convertX = function( event ){
		var x = event.clientX - ( document.body.clientWidth - field.width ) / 2;
		if ( x < 0 ) x = 0;
		if ( x > field.width ) x = field.width;
		this.x = x;
		return x; 
	}
	this.setShift = function(){
		this.shift = this.x - pad.left;
	}
}
function Field(){
	this.source = document.getElementById("field");
	this.width = this.source.offsetWidth;
	this.height = this.source.offsetHeight;
	this.left = this.source.offsetLeft;
	this.fill = function(){
		bricks=[]
		document.getElementById("bricks-layer").innerHTML = "";
		for ( id = 0; id < 10; id++ ) bricks[id] = new Brick(id, "p7");
		for ( id = 10; id < 20; id++ ) bricks[id] = new Brick(id, "p5");
		for ( id = 20; id < 30; id++ ) bricks[id] = new Brick(id, "p3");
	}
}
function Pad(){
	this.speed = 200;
//	this.speed = 1.5; // px per millisecond
	this.x = 0;
	this.source = document.getElementById("racket")
	this.width = this.source.offsetWidth;
	this.height = this.source.offsetHeight;
	this.top = this.source.offsetTop;
	this.path = field.width - this.width;
	var step = this.speed * 0.2;
	var move = step;
	this.left = ( this.path - this.width ) / 2;
//	this.source.style.left = this.source.offsetLeft;

	this.move = function()
	{
		if (kbd.isPressed('right') || ms.shift > 0 && !kbd.isPressed('left')) 
		{
			if (this.left < this.path) 
			{
				((this.path - this.left) < step) ? move = this.path - this.left : move = step;
				
				if (ms.shift < move && ms.shift > 0) 
					move = ms.shift;
				
				this.left += move;
				ms.setShift();
			}
		} else if (kbd.isPressed('left') || ms.shift < 0) 
		{
			if (this.left > 0) 
			{
				(this.left < step) ? move = -this.left : move = -step;
				
				if (ms.shift > move && ms.shift < 0) 
					move = ms.shift;
				
				this.left += move;
				ms.setShift();
			}
		}
		this.set(this.left);
		App.say(this.speed.x)
	}
	this.set = function(x){ 
		this.source.style.left = x + 'px';
		this.left = x;
	}
}
function Brick(id, type){
	var layer = document.getElementById("bricks-layer");
    var brickCell = document.createElement("div");
    brickCell.className = "brick " + type;
	brickCell.id = id;
	this.id = id;
	this.width = brickCell.offsetWidth;
    var brick = document.createElement("p");
    brickCell.appendChild(brick);
    layer.appendChild(brickCell);
    this.hitted = false; 
	// ^!!!!!^
	this.contains = function(x, y){
		return (x > brickCell.offsetLeft &&
		 (x < brickCell.offsetLeft + brickCell.offsetWidth) &&
		  y > brickCell.offsetTop && 
		  (y < brickCell.offsetTop + brickCell.offsetHeight));
	}
	this.hit = function(){
		if (document.getElementById(this.id)) {
			this.hitted = true;
			sound.play('brick');
			document.getElementById(this.id).innerHTML = "";
			document.getElementById(this.id).removeAttribute("id")
			//document.getElementById(this.id).id = "";
			switch (type) {
				case "p3":
					App.state.points += 3
					break
				case "p5":
					App.state.points += 5
					break
				case "p7":
					App.state.points += 7
					break
			}
			return true;
		} else return false;
	}
}
Bricks = {
	getId : function(ix,iy){
		for (i=0; i<bricks.length; i++){
			if (bricks[i].contains(ix,iy)) return i;
		}
	},
}
function Display(){
	this.countdown = function(){
		var shots = ["3", "2", "1", "GO", ""];
		var counter = document.getElementById("message");
		App.stop();
		counter.style.display = "table-cell";
		var i = 0;
		function post(){
			setTimeout(function(){
				if (i < shots.length) {
					counter.innerHTML = shots[i];
					i++;
					post();
				} else{
					App.start();
				}
			}, 1000);
		}
		post();
	}
	this.message = function(msg){
		var messageBox = document.getElementById("message");
		messageBox.innerHTML = msg;
		App.stop();
		messageBox.style.display = 'table-cell';
	}
	this.clear = function(){
		document.getElementById("message").style.display = 'none';
	}
}
function Ball()
{
	this.v = 250;
	var initangle = randomAngle();
	this.speed = {
		x : getSpeedProjections(this.v, initangle)[0],
		y : -getSpeedProjections(this.v, initangle)[1]
//		x: -10,
//		y: -20,
	};
	App.say(this.speed.x + ' ' + this.speed.y);
	this.element = document.getElementById("ball");
	this.left = this.element.offsetLeft;
	this.top = this.element.offsetTop;
	this.width = this.element.offsetWidth;
	this.height = this.element.offsetHeight;
	this.x = this.left; this.y = this.top;
	this.px = this.x; this.py = this.y
	this.set = function(x,y){
		ball.x = x;
		ball.y = y;
		ball.element.style.left = x + 'px';
		ball.element.style.top = y + 'px';
		//App.say('ball x: ' + ball.element.style.left + '; y: ' + ball.element.style.top);
	}
}
function Stack()
{
	this.counter = 0;
	this.items = [];
	this.add = function(item)
	{
		this.items.push(item);
		this.counter++;
	}
	this.min = function(index)
	{
		for (k = this.items.length - 1; k > 0; k--) 
		{
			for (j = 0; j < k; j++) 
			{
				if (this.items[j].r > this.items[j + 1].r) 
				{
					m = this.items[j];
					this.items[j] = this.items[j + 1];
					this.items[j + 1] = m;
				}
			}
		}
		return this.items[index];
	}
}
function Player(){
	this.add = function(id, file)
	{
		var added = document.getElementById(id);
		if (!added)
		{
			var audio = document.createElement('audio');
			audio.id = id;
			audio.setAttribute('src', 'sounds/' + file);
			audio.setAttribute('preload', 'auto');
			audio.setAttribute('autobuffer', '');
			document.body.appendChild(audio);
			App.say('Added ' + file + '; id is ' + id);
		}
		else if (added.getAttribute('src') === "sounds/" + file)
			App.say('Already added')
		else if (added && added.getAttribute('src') != "sounds/" + file)
			App.say('Identifier already exists');
	}
	this.play = function(id)
	{
		if (App.sounds) 
		{
			if (document.getElementById(id)) 
			{
				document.getElementById(id).play();
				App.say('played ' + id);
			} else
				App.say('Wrong identifier');
		} else
				App.say ('Sound is disabled');
	}
}
