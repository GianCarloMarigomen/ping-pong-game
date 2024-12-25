const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let ballSpeedX = 4;
let ballSpeedY = 4;
let ballRadius = 10;
let playerSpeed = 4;
let computerSpeed = 4;
let playerScore = 0;
let computerScore = 0;

// Paddle dimensions
const paddleWidth = 10;
const paddleHeight = 100;

// Paddle positions
let playerY = canvas.height / 2 - paddleHeight / 2;
let computerY = canvas.height / 2 - paddleHeight / 2;

// Ball position
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

// Controls for player paddle
let upArrowPressed = false;
let downArrowPressed = false;

// Handle key events for player paddle movement
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") upArrowPressed = true;
  if (event.key === "ArrowDown") downArrowPressed = true;
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") upArrowPressed = false;
  if (event.key === "ArrowDown") downArrowPressed = false;
});

// Draw the ball
function drawBall() {
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
  ctx.fill();
}

// Draw paddles
function drawPaddles() {
  ctx.fillStyle = "red";
  ctx.fillRect(0, playerY, paddleWidth, paddleHeight); // Player paddle
  ctx.fillRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight); // Computer paddle
}

// Move the ball
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top and bottom walls
  if (ballY <= 0 || ballY + ballRadius >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Ball collision with player paddle
  if (ballX - ballRadius <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
    // Ball's angle after hitting player paddle
    let deltaY = ballY - (playerY + paddleHeight / 2);
    ballSpeedY = deltaY * 0.2; // Ball's speed depends on the paddle hit location
  }

  // Ball collision with computer paddle
  if (ballX + ballRadius >= canvas.width - paddleWidth && ballY >= computerY && ballY <= computerY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
    // Ball's angle after hitting computer paddle
    let deltaY = ballY - (computerY + paddleHeight / 2);
    ballSpeedY = deltaY * 0.2; // Ball's speed depends on the paddle hit location
  }

  // Ball out of bounds (scoring)
  if (ballX <= 0) {
    computerScore++;
    resetBall();
  } else if (ballX >= canvas.width) {
    playerScore++;
    resetBall();
  }
}

// Move player paddle
function movePlayer() {
  if (upArrowPressed && playerY > 0) playerY -= playerSpeed;
  if (downArrowPressed && playerY + paddleHeight < canvas.height) playerY += playerSpeed;
}

// Move computer paddle
function moveComputer() {
  // Follow the ball, but with some delay to make it challenging
  if (computerY + paddleHeight / 2 < ballY) {
    computerY += computerSpeed;
  } else {
    computerY -= computerSpeed;
  }

  // Prevent computer paddle from going out of bounds
  if (computerY < 0) computerY = 0;
  if (computerY + paddleHeight > canvas.height) computerY = canvas.height - paddleHeight;
}

// Reset the ball to the center
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX; // Change ball direction
}

// Draw score
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Player: " + playerScore, 50, 30);
  ctx.fillText("Computer: " + computerScore, canvas.width - 150, 30);
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  moveBall();
  movePlayer();
  moveComputer();
  drawBall();
  drawPaddles();
  drawScore();

  requestAnimationFrame(gameLoop); // Keep the game loop running
}

// Start the game
gameLoop();
