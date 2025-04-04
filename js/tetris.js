const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 20;

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;

const SHAPES = [
    [[1, 1, 1, 1]], // I shape
    [[1, 1], [1, 1]], // O shape
    [[0, 1, 0], [1, 1, 1]], // T shape
    [[1, 1, 0], [0, 1, 1]], // S shape
    [[0, 1, 1], [1, 1, 0]], // Z shape
    [[1, 0, 0], [1, 1, 1]], // L shape
    [[0, 0, 1], [1, 1, 1]], // J shape
];

function getRandomShape() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return { shape, row: 0, col: Math.floor((COLS - shape[0].length) / 2) };
}

let currentPiece = getRandomShape();

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c]) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function drawPiece() {
    ctx.fillStyle = 'red';
    currentPiece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                ctx.fillRect(
                    (currentPiece.col + c) * BLOCK_SIZE,
                    (currentPiece.row + r) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
                ctx.strokeRect(
                    (currentPiece.col + c) * BLOCK_SIZE,
                    (currentPiece.row + r) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
            }
        });
    });
}

function movePieceDown() {
    currentPiece.row++;
    if (collision()) {
        currentPiece.row--;
        placePiece();
        resetPiece();
    }
}

function collision() {
    return currentPiece.shape.some((row, r) =>
        row.some((cell, c) => {
            if (cell) {
                let newRow = currentPiece.row + r;
                let newCol = currentPiece.col + c;
                return (
                    newRow >= ROWS ||
                    newCol < 0 ||
                    newCol >= COLS ||
                    board[newRow][newCol]
                );
            }
            return false;
        })
    );
}

function placePiece() {
    currentPiece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                board[currentPiece.row + r][currentPiece.col + c] = 1;
            }
        });
    });
    clearLines();
}

function rotatePiece() {
    const rotatedShape = currentPiece.shape[0].map((_, colIndex) =>
        currentPiece.shape.map(row => row[colIndex]).reverse()
    );
    const originalShape = currentPiece.shape;
    currentPiece.shape = rotatedShape;
    if (collision()) {
        currentPiece.shape = originalShape;
    }
}

function movePieceLeft() {
    currentPiece.col--;
    if (collision()) {
        currentPiece.col++;
    }
}

function movePieceRight() {
    currentPiece.col++;
    if (collision()) {
        currentPiece.col--;
    }
}

function resetPiece() {
    currentPiece = getRandomShape();
    if (collision()) {
        gameOver();
    }
}

function clearLines() {
    const initialLength = board.length;
    board = board.filter(row => row.some(cell => cell === 0));
    const clearedLines = initialLength - board.length;
    score += clearedLines * 10;
    while (board.length < ROWS) {
        board.unshift(Array(COLS).fill(0));
    }
}

const gameOverOverlay = document.getElementById('gameOverOverlay');
const restartButton = document.getElementById('restartButton');

restartButton.addEventListener('click', () => {
    gameOverOverlay.style.display = 'none';
    resetGame();
});

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    currentPiece = getRandomShape();
    score = 0;
    gameLoop();
}

function gameOver() {
    gameOverOverlay.style.display = 'flex';
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        movePieceLeft();
    } else if (event.key === 'ArrowRight') {
        movePieceRight();
    } else if (event.key === 'ArrowUp') {
        rotatePiece();
    } else if (event.key === 'ArrowDown') {
        movePieceDown();
    }
});

function gameLoop() {
    movePieceDown();
    drawBoard();
    drawPiece();
    setTimeout(gameLoop, 500); // Ensure the game loop runs continuously
}

// Start the game loop
gameLoop();

document.addEventListener('DOMContentLoaded', () => {
    document.dispatchEvent(new Event('gameStarted'));
});

gameLoop();