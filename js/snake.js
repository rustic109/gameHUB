const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
const canvasSize = 20; // Number of boxes in width/height
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = 'RIGHT';
let nextDirection = 'RIGHT'; // Prevent immediate reversal
let food = {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box,
};
let gameRunning = true;
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.dispatchEvent(new Event('gameStarted')); // Trigger "gameStarted" event
});

canvas.width = canvasSize * box;
canvas.height = canvasSize * box;

canvas.style.border = '1px solid black';

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') nextDirection = 'UP';
    else if (event.key === 'ArrowDown' && direction !== 'UP') nextDirection = 'DOWN';
    else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') nextDirection = 'LEFT';
    else if (event.key === 'ArrowRight' && direction !== 'LEFT') nextDirection = 'RIGHT';
}

function drawGame() {
    if (!gameRunning) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    direction = nextDirection;

    let head = { ...snake[0] };
    if (direction === 'UP') head.y -= box;
    if (direction === 'DOWN') head.y += box;
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'RIGHT') head.x += box;

    if (head.x < 0 || head.x + box > canvas.width || head.y < 0 || head.y + box > canvas.height) {
        console.error('Collision with wall detected:', { head, canvasWidth: canvas.width, canvasHeight: canvas.height });
        gameOver();
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            console.error('Collision with self detected:', { head, segment: snake[i], snake });
            gameOver();
            return;
        }
    }

    if (head.x === food.x && head.y === food.y) {
        score++; 
    
        do {
            food = {
                x: Math.floor(Math.random() * canvasSize) * box,
                y: Math.floor(Math.random() * canvasSize) * box,
            };
        } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    } else {
        snake.pop(); 
    }

    snake.unshift(head); 

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameOver() {
    gameRunning = false;
    console.error('Game Over! Debug Info:', {
        snake,
        food,
        direction,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
    });
    alert('Game Over!');
    document.dispatchEvent(new Event('gamePlayed')); // Trigger "gamePlayed" event
    document.location.reload();
}

setInterval(() => {
    if (gameRunning) drawGame();
}, 100);
