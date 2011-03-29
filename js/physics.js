
function solve(x1, y1, x2, y2, bx, by, dx, dy)
{
	A1 = y1 - y2; B1 = x2 - x1; C1 = x1*y2 - x2*y1;
	A2 = by - dy; B2 = dx - bx; C2 = bx*dy - dx*by;
	det = A1*B2 - A2*B1;
	det1 = -C1*B2 + B1*C2;
	det2 = -C2*A1 + A2*C1;
	//hey, those lines shouldn't be parallel there!
	x = det1/det;
	y = det2/det;
	return [x,y]
}

function sgn(a)
{
	a>0 ? a=1 : ( a<0 ? a=-1 : a=0 );
	return a;
}
function mirror(x1, y1, x2, y2, xx, xy, dx, dy)
{
	var ddx = dx - 2*(dx - xx)*sgn(y2 - y1)
	var ddy = dy - 2*(dy - xy)*sgn(x2 - x1)
	return [ddx, ddy]
}

function solveball(l1, l2, bx, by, dx, dy)
{
	ans = solveballcoord(l1[0], l1[1], l2[0], l2[1], bx, by, dx, dy)
	return ans
}

function solveballcoord(x1, y1, x2, y2, bx, by, dx, dy)
{
	var x = solve(x1, y1, x2, y2, bx, by, dx, dy);
	if ( ((x[0] < x1) && (x[0] > x2)) || ((x[1] < y1) && (x[1] > y2)) )
	{
		return [x[0], x[1], dx, dy]
	}
	var dd = mirror(x1, y1, x2, y2, x[0], x[1], dx, dy);
	return [x[0], x[1], dd[0], dd[1]]
}

physics = {
	step: function()
	{
		//Reflection from walls
		
		ball.px = ball.x + ball.speed.x;
		ball.py = ball.y + ball.speed.y;
		App.say("==== start ==== \n" + "bx=" + ball.x + " by=" + ball.y)
		ppy = ball.py
		ppx = ball.px
	//	if(py < field.dots[0][1]) {
		if ( (ball.py <= 0) && (ball.speed.y < 0) ){
			App.say("py < 0");
			ppy = 0
			ball.speed.y = -ball.speed.y
		}
	//	if(px < field.dots[0][0]) {
		if ( (ball.px < 0) && (ball.speed.x < 0) ){
			App.say("px < 0");
			ppx = 0
			ball.speed.x = -ball.speed.x
		}
	//	if(px > field.dots[2][0]) {
		if ( (ball.px > field.width-ball.width) && (ball.speed.x > 0) ) {
			App.say("px > width");
			ppx = field.width-ball.width
			ball.speed.x = -ball.speed.x
		}

	//	if(py > field.dots[2][1]) {
		if ( (ball.py > field.height-ball.height-pad.height) && (ball.speed.y > 0) ) {
			App.say("py > height");
			
			//Reflection from pad
			
			h = field.height-ball.height-pad.height;
			//here will be pad
			padxx = Math.ceil( parseFloat(pad.left) + pad.speed.x*(h-ball.y)/(ball.py-ball.y) );
			bw = ball.x + ball.width;
			App.say("padxx=" + padxx + "\nball.x=" + ball.x);
			if  (	( (ball.x > padxx) && (ball.x < padxx + pad.width) ) 
					||
					( (bw > padxx) && (bw < padxx + pad.width) ) 
				)	
			{
				ppy = h+5
				ball.speed.y = -ball.speed.y
			}		
			else
			{
				App.say("You loose.")
				App.state.lives --;
				lives.innerHTML = App.state.lives;
				App.stop();
				
			}
			
//			ppy = field.height-ball.height-pad.height+5
//			ball.speed.y = -ball.speed.y
		}

		ball.x = ppx
		ball.y = ppy
		ball.element.style.left = ball.x + 'px';
		ball.element.style.top = ball.y + 'px';
		App.say("px=" + ball.px + " py=" + ball.py + "\n ==== end ====");

		
	}
}



