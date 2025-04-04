const rows = 10;
const cols = 10;
const minesCount = 20;

const gameContainer = document.getElementById('gameContainer');
let board = [];
let revealed = [];
let gameOver = false;
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.dispatchEvent(new Event('gameStarted')); // Trigger "gameStarted" event
    initializeGame();
});

function initializeGame() {
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
    gameOver = false;
    score = 0;

    placeMines();
    calculateNumbers();
    renderBoard();
}

function placeMines() {
    let placedMines = 0;
    while (placedMines < minesCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (board[r][c] === 0) {
            board[r][c] = 'M';
            placedMines++;
        }
    }
}

function calculateNumbers() {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 'M') continue;

            let mines = 0;
            directions.forEach(([dr, dc]) => {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === 'M') {
                    mines++;
                }
            });
            board[r][c] = mines;
        }
    }
}

function renderBoard() {
    gameContainer.innerHTML = '';
    gameContainer.style.display = 'grid';
    gameContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    gameContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (revealed[r][c]) {
                cell.classList.add('revealed');
                if (board[r][c] === 'M') {
                    cell.textContent = '💣';
                } else if (board[r][c] > 0) {
                    cell.textContent = board[r][c];
                }
            }

            cell.addEventListener('click', () => handleCellClick(r, c));
            gameContainer.appendChild(cell);
        }
    }

    // Display score
    const scoreElement = document.getElementById('score');
    if (!scoreElement) {
        const scoreDiv = document.createElement('div');
        scoreDiv.id = 'score';
        scoreDiv.textContent = `Score: ${score}`;
        gameContainer.parentElement.insertBefore(scoreDiv, gameContainer);
    } else {
        scoreElement.textContent = `Score: ${score}`;
    }
}

function handleCellClick(r, c) {
    if (gameOver || revealed[r][c]) return;

    revealed[r][c] = true;

    if (board[r][c] === 'M') {
        gameOver = true;
        revealAll();
        alert('Game Over!');
        document.dispatchEvent(new Event('gamePlayed')); // Trigger "gamePlayed" event
        return;
    }

    if (board[r][c] === 0) {
        revealEmptyCells(r, c);
    } else {
        score += board[r][c];
    }

    renderBoard();
    checkWin();
}

function revealEmptyCells(r, c) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    const stack = [[r, c]]; // Use a stack to avoid deep recursion

    while (stack.length > 0) {
        const [currentR, currentC] = stack.pop();

        if (currentR < 0 || currentR >= rows || currentC < 0 || currentC >= cols || revealed[currentR][currentC]) {
            continue; // Skip out-of-bounds or already revealed cells
        }

        revealed[currentR][currentC] = true;

        if (board[currentR][currentC] === 0) {
            directions.forEach(([dr, dc]) => {
                const newR = currentR + dr;
                const newC = currentC + dc;
                if (newR >= 0 && newR < rows && newC >= 0 && newC < cols && !revealed[newR][newC]) {
                    stack.push([newR, newC]);
                }
            });
        }
    }
}

function revealAll() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            revealed[r][c] = true;
        }
    }
    renderBoard();
}

function checkWin() {
    let unrevealedCount = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!revealed[r][c]) unrevealedCount++;
        }
    }
    if (unrevealedCount === minesCount) {
        gameOver = true;
        revealAll();
        alert('You Win!');
    }
}
