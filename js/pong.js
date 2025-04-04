const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;

let gameRunning = true; // Ensure the game starts running

const gameOverOverlay = document.getElementById('gameOverOverlay');
const restartButton = document.getElementById('restartButton');

restartButton.addEventListener('click', () => {
    gameOverOverlay.style.display = 'none';
    resetGame();
});

document.addEventListener('keydown', movePaddles);

document.addEventListener('DOMContentLoaded', () => {
    document.dispatchEvent(new Event('gameStarted')); // Trigger "gameStarted" event
});

function movePaddles(event) {
    if (event.key === 'w' && player1Y > 0) player1Y -= 20;
    if (event.key === 's' && player1Y < canvas.height - paddleHeight) player1Y += 20;
    if (event.key === 'ArrowUp' && player2Y > 0) player2Y -= 20;
    if (event.key === 'ArrowDown' && player2Y < canvas.height - paddleHeight) player2Y += 20;
}

function drawGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'blue';
    ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);

    ctx.fillStyle = 'red';
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY *= -1;

    if (
        (ballX <= paddleWidth && ballY + ballSize >= player1Y && ballY <= player1Y + paddleHeight) ||
        (ballX + ballSize >= canvas.width - paddleWidth && ballY + ballSize >= player2Y && ballY <= player2Y + paddleHeight)
    ) {
        ballSpeedX *= -1;
    }

    if (ballX < 0) {
        player2Score++; // Increment player 2's score
        resetBall();
    } else if (ballX > canvas.width) {
        player1Score++; // Increment player 1's score
        resetBall();
    }

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Player 1: ${player1Score}`, 10, 20);
    ctx.fillText(`Player 2: ${player2Score}`, canvas.width - 120, 20);

    if (player1Score >= 10 || player2Score >= 10) {
        gameOver();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1; // Reverse ball direction
    ballSpeedY = 4; // Reset vertical speed
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    resetBall();
    gameRunning = true;
}

function gameOver() {
    gameRunning = false;
    gameOverOverlay.style.display = 'flex';
}

setInterval(drawGame, 16);
