App = {
	debugMode : true,
//	cycleDuration: 1000, //in miliseconds
	running: true,
	sounds: false,
	say : function(info)
	{
		if(this.debugMode) {console.log(info);} ;
	},
	// this function is executed at startup
	load : function()
	{
		kbd = new Keyboard();
		ms = new Mouse();
		field = new Field();
		pad = new Pad();
		padLoop();
		display = new Display();
		ball = new Ball();
		field.fill();
		sound = new Player();
		sound.add('wall', 'wall.wav');
		sound.add('brick', 'brick-low.wav');
		App.reset();
		App.start();

		walls = [ 
			[{x: 0, y:field.height}, {x: 0, y: 0}], 
			[{x: 0, y: 0}, {x: field.width, y:0}], 
//			[{x: field.width, y:0}, {x: field.width, y: field.height}],
			//FIXME for debug purposes only
			[{x: field.width, y:0}, {x: field.width, y: field.height}], 
			[ {x: 0, y: field.height}, {x: field.width, y:field.height}], 
		];
		ball.sides = [ 
			{x: Math.round(ball.width/2), y: 0}, 
			{x: ball.width, y: Math.round(ball.height/2)}, 
			{x: Math.round(ball.width/2) , y: ball.height}, 
			{x: 0, y:Math.round(ball.height/2)} 
		];
		
		if (!App.debugMode) display.countdown();
		points = document.getElementById("points");
		lives = document.getElementById("lives");
		App.state.lives = 5;
		App.state.points = 0;
		document.addEventListener( 'keydown', function(event){
			ms.shift = 0;
			if (!kbd.isPressed(kbd.key[event.which])) kbd.setPressed(kbd.key[event.which]);
			if (kbd.key[event.which] === 'left'||
				kbd.key[event.which] === 'right')
					document.getElementById(kbd.key[event.which]).className = "pressed";
		},false);
		
		document.addEventListener( 'keyup', function(event){
			ms.shift = 0;
			if (kbd.isPressed(kbd.key[event.which])) kbd.setReleased(kbd.key[event.which]);
			if (kbd.key[event.which] === 'left'||
				kbd.key[event.which] === 'right')
					document.getElementById(kbd.key[event.which]).className = "";
		},false);
		document.addEventListener( 'mousemove', function(event){
			ms.x = ms.convertX(event);
			ms.setShift();
		},false);
		field.source.addEventListener('click', function(){
			if (!App.running && (App.state.lives === 0 || App.state.points === 150)) App.load();
		},false);
		document.addEventListener('keypress', function(event){
			if (!App.running &&
				(kbd.isPressed('enter') || kbd.isPressed('space')) &&
				(App.state.lives === 0  || App.state.points === 150) )
					App.load();
		}, false);
		/*For the buttons on the screen*/
		document.getElementById("left").onmousedown = function(){
			kbd.setPressed('left');
		}
		document.getElementById("left").onmouseup = function(){
			kbd.setReleased('left');
		}
		document.getElementById("right").onmousedown = function(){
			kbd.setPressed('right');
		}
		document.getElementById("right").onmouseup = function(){
			kbd.setReleased('right');
		}
		document.getElementById("right").ontouchend = function(){
			kbd.setReleased('right');
		}
		document.addEventListener( 'touchmove', function(event)
		{
			ms.x = ms.convertX(event);
			ms.setShift();
		},false);
	},
	// main game cycle
	update : function()
	{
		physics.step();
		points.innerHTML = App.state.points;
		lives.innerHTML = App.state.lives;
		if (App.state.points === 150){
			App.stop();
			points.innerHTML = App.state.points;
			display.message("Congratulations!<br>You've won");
			return;
		}
		if (App.state.lives === 0) {
			App.gameOver();
			return;
		}
	},
	state: {
		points: 0,
		lives: 5,
	},
	reset : function(){
		ball.set( field.width/2 - ball.width/2,  field.height-ball.height-pad.height);
		pad.set( field.width/2 - pad.width/2 );
		App.say("resetted");
	},
	start : function(){
		display.clear();
		App.running = true;
	},
	stop : function(){
		App.running = false;
	},
	restart : function(){
		$('ball').setStyle('-webkit-transition-duration', '0');
		$('ball').setStyle('-moz-transition', 'none');
		$('ball').setStyle('-o-transition-duration', '0');
		$('ball').setStyle('transition-duration', '0');
		App.reset();
/*		setTimeout(function(){
			App.update();
			$('ball').setStyle('-webkit-transition-duration', '.2s');
			$('ball').setStyle('-moz-transition', 'all .24s linear');
			$('ball').setStyle('-o-transition-duration', '.2s');
			$('ball').setStyle('transition-duration', '.2s');
			App.start();
		}, 1000);
*/		
	},
	gameOver: function(){
		App.stop();
		display.message("You've lost.<br>Click or press Enter to play again.");
	}
};


function AppLoop(){
	if (App.running) {App.update();}
	setTimeout(AppLoop, App.cycleDuration);
}
function padLoop(){
	if (App.running) {pad.move()}
	setTimeout(padLoop, 200);
}
$(document).on('ready', function() {
	App.load();
	App.reset();
	AppLoop();
//	$('field').on('click', function()
//	{
//		physics.step();
//	});
});
