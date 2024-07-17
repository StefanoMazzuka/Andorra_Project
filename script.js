let selectedNumber = null;

function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num || 
            board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
            return false;
        }
    }
    return true;
}

function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function generateSudokuSolution() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveSudoku(board);
    return board;
}

function removeNumbers(board, emptySpaces) {
    while (emptySpaces > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            emptySpaces--;
        }
    }
    return board;
}

function hasAtLeastOneSolution(board) {
    let clonedBoard = board.map(row => row.slice());
    return solveSudoku(clonedBoard);
}

function generateSudoku(emptySpaces = 40) {
    let board;
    do {
        board = generateSudokuSolution();
        removeNumbers(board, emptySpaces);
    } while (!hasAtLeastOneSolution(board));
    return board;
}

function createSudokuBoard(board) {
    const boardContainer = document.getElementById('sudoku-board');
    boardContainer.innerHTML = '';

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('img');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.src = board[row][col] === 0 ? 'resources/0.png' : 'resources/' + board[row][col] + '.png';
            cell.classList.add(board[row][col] === 0 ? 'empty' : 'filled');
            cell.addEventListener('click', () => {
                if (selectedNumber && cell.classList.contains('empty')) {
                    cell.src = selectedNumber;
                }
            });
            boardContainer.appendChild(cell);
        }
    }
}

function getBoardFromInputs() {
    const board = [];
    const regex = /\/(\d)\.png/;
    const cells = document.querySelectorAll('#sudoku-board img');
    for (let row = 0; row < 9; row++) {
        const rowArray = [];
        for (let col = 0; col < 9; col++) {
            const src = cells[row * 9 + col].src;
            const match = src.match(regex);
            const value = match ? match[1] : null;
            rowArray.push(value === '0' ? 0 : parseInt(value, 10));
        }
        board.push(rowArray);
    }
    return board;
}

function fillSudokuBoard(board) {
    const cells = document.querySelectorAll('#sudoku-board img');
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            cells[row * 9 + col].src = board[row][col] === 0 ? 'resources/0.png' : 'resources/' + board[row][col] + '.png';
        }
    }
}

document.querySelectorAll('.number-btn').forEach(img => {
    img.addEventListener('click', () => {
        selectedNumber = img.src;
    });
});

document.getElementById('generate-btn').addEventListener('click', () => {
    const sudoku = generateSudoku(40);
    createSudokuBoard(sudoku);
});

document.getElementById('solve-btn').addEventListener('click', () => {
    const board = getBoardFromInputs();
    if (solveSudoku(board)) {
        fillSudokuBoard(board);
    } else {
        alert('No se puede resolver este Sudoku.');
    }
});