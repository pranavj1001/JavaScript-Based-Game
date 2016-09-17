//variables of the canvas
var canvas;
var canvasContext;

//variables of the ball
var ballX = 50;
var ballY = 50;
var ballspeedX = 10;
var ballspeedY = 4;

//variables of the paddle
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;

//variables of the scores
var player1Score = 0;
var player2Score = 0;
var showingWinScreen = false;
const WINNING_SCORE = 3;

//an event is fired whenever the mouse moves which is handled by the function given below (evt stands for event)
function calculateMousePosition(evt) {
	var rect = canvas.getBoundingClientRect(); 				// get handle on the black area on the browser 
	var root = document.documentElement;					// get handle on the html document
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.left - root.scrollLeft;
	return{
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt){
	if(showingWinScreen){
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 23;
	setInterval(function() {
			moveEverything(); // moving mechanism
			drawEverything(); // drawing mechanism	
		}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown',handleMouseClick);
	canvas.addEventListener('mousemove',
		function(evt){
			var mousePosition = calculateMousePosition(evt);
			paddle1Y = mousePosition.y - (PADDLE_HEIGHT/2);
		});
}

function ballReset(){
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
		player1Score = 0;			//Reseting Scores if Winning Condition is achieved
		player2Score = 0;
		showingWinScreen = true;
	}
	ballspeedX = -ballspeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}


//AI Function
function computerMovement(){
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

	if(paddle2YCenter < ballY - 35){
		paddle2Y += 6;   //Speed of the Computer paddle
	}else if(paddle2YCenter > ballY + 35){
		paddle2Y -= 6;	 //Speed of the Computer paddle	
	}
}

function moveEverything() {

	if(showingWinScreen){
		return;
	}

	computerMovement();

	ballX += ballspeedX;
	ballY += ballspeedY;

	// what if the ball goes to the right of the screen
	if(ballX > canvas.width){
		if(ballY > paddle2Y && ballY < (paddle2Y+PADDLE_HEIGHT)){
			ballspeedX = -ballspeedX;
			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
			ballspeedY = deltaY * 0.35;
		}else{
			player1Score++; //must be before ball Reset
			ballReset();
		}
	}

	// what if the ball goes to the left of the screen
	if(ballX < 0){
		if(ballY > paddle1Y && ballY < (paddle1Y+PADDLE_HEIGHT)){
			ballspeedX = -ballspeedX;
			var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
			ballspeedY = deltaY * 0.35;
		}else{
			player2Score++; //must be before ball Reset
			ballReset();
		}
	}
	// what if the ball goes to the bottom of the screen
	if(ballY > canvas.height){
		ballspeedY = -ballspeedY;
	}

	//what if the ball goes to the top of the screen
	if(ballY < 0){
		ballspeedY = -ballspeedY;
	}
}

function drawNet(){
	for(var i=0;i<canvas.height;i+=40){
		colorRect(canvas.width/2-1,i,2,20,'white');
	}
}

function drawEverything() {
	// next line blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height,'black');

	if(showingWinScreen){
		if(player1Score > player2Score){
			canvasContext.fillStyle ='white';
			canvasContext.fillText("Human Wins!\n We'll survive :( Click TO Continue",300,100);
			canvasContext.fillText("Click TO Continue",350,500);
		}else{
			canvasContext.fillStyle ='white';
			canvasContext.fillText("Computer Wins!\n Wait for total annhilation :)",300,100);
			canvasContext.fillText("Click TO Continue",350,500);
		}
		return;
	}

	//draws the net
	drawNet();

	// this is the left player paddle
	colorRect(0,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');

	// this is the right player paddle
	colorRect((canvas.width-PADDLE_WIDTH),paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');

	// this is the ball
	colorCircle(ballX,ballY,10,'white');

	//Scores!
	canvasContext.fillText(player1Score, canvas.width-700,canvas.height-500);
	canvasContext.fillText(player2Score, canvas.width-100,canvas.height-500);	
}

//helper function for making the circle
function colorCircle(centerX,centerY,radius,drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

//helper function for making the rectangles
function colorRect(leftX,topY,width,height,drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height, drawColor);
}