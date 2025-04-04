const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const birdSize = 20;
let birdY = canvas.height / 2;
let birdSpeed = 0;
const gravity = 0.5; 
const jump = -10;

const pipeWidth = 50;
const pipeGap = 200; 
let pipes = [{ x: canvas.width, y: Math.random() * (canvas.height - pipeGap) }];
let gameRunning = true;
let gameStart = false; 
let countdown = 5; 
let score = 0;

document.addEventListener('keydown', () => {
    if (gameRunning && gameStart) birdSpeed = jump;
});

document.addEventListener('DOMContentLoaded', () => {
    document.dispatchEvent(new Event('gameStarted')); // Trigger "gameStarted" event
});

function drawCountdown() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Game starts in ${countdown}`, canvas.width / 2, canvas.height / 2);
}

function startGame() {
    gameStart = true;
    setInterval(drawGame, 16); 
}

function initializeGame() {
    const countdownInterval = setInterval(() => {
        drawCountdown();
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            startGame();
        }
    }, 1000);
}

initializeGame(); 

function drawGame() {
    if (!gameRunning || !gameStart) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

  
    ctx.fillStyle = 'yellow';
    ctx.fillRect(50, birdY, birdSize, birdSize);

   
    birdSpeed += gravity;
    birdY += birdSpeed;

   
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
        pipe.x -= 2;

       
        if (
            (50 + birdSize > pipe.x && 50 < pipe.x + pipeWidth &&
                (birdY < pipe.y || birdY + birdSize > pipe.y + pipeGap)) ||
            birdY + birdSize > canvas.height || birdY < 0
        ) {
            gameOver();
        }

        // Increment score when the bird passes a pipe
        if (!pipe.scored && pipe.x + pipeWidth < 50) {
            score++;
            pipe.scored = true; // Mark pipe as scored
        }
    });


    if (pipes[0].x + pipeWidth < 0) pipes.shift();
    if (pipes[pipes.length - 1].x < canvas.width - 200) {
        pipes.push({ x: canvas.width, y: Math.random() * (canvas.height - pipeGap) });
    }

  
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameOver() {
    gameRunning = false;
    alert('Game Over!');
    document.dispatchEvent(new Event('gamePlayed')); // Trigger "gamePlayed" event
    document.location.reload();
}
