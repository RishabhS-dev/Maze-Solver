/* script.js */
const rows = 20, cols = 20;
let start = [0, 0], end = [rows - 1, cols - 1];
let grid = Array.from({ length: rows }, () => Array(cols).fill(0));
const gridContainer = document.getElementById("grid");
const resetBtn = document.getElementById("reset");
const randomMazeBtn = document.getElementById("random-maze");
const solveBtn = document.getElementById("solve");

function createGrid() {
    gridContainer.innerHTML = "";
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            if (r === start[0] && c === start[1]) cell.classList.add("start");
            else if (r === end[0] && c === end[1]) cell.classList.add("end");
            cell.addEventListener("click", toggleWall);
            gridContainer.appendChild(cell);
        }
    }
}

function toggleWall(event) {
    let row = event.target.dataset.row, col = event.target.dataset.col;
    if ((row == start[0] && col == start[1]) || (row == end[0] && col == end[1])) return;
    grid[row][col] = grid[row][col] === 0 ? 1 : 0;
    event.target.classList.toggle("wall");
}

function solveMaze() {
    let queue = [[start, []]];
    let visited = new Set();
    while (queue.length) {
        let [[x, y], path] = queue.shift();
        if (x === end[0] && y === end[1]) {
            visualizePath(path);
            return;
        }
        if (visited.has(`${x},${y}`)) continue;
        visited.add(`${x},${y}`);
        path.push([x, y]);
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
            let nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] === 0) {
                queue.push([[nx, ny], [...path]]);
            }
        });
    }
}

function visualizePath(path) {
    path.forEach(([r, c], index) => {
        setTimeout(() => {
            document.querySelector(`[data-row='${r}'][data-col='${c}']`).classList.add("path");
        }, 50 * index);
    });
}

function resetGrid() {
    grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    createGrid();
}

function generateRandomMaze() {
    resetGrid();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (Math.random() < 0.3 && !(r === start[0] && c === start[1]) && !(r === end[0] && c === end[1])) {
                grid[r][c] = 1;
            }
        }
    }
    createGrid();
}

resetBtn.addEventListener("click", resetGrid);
randomMazeBtn.addEventListener("click", generateRandomMaze);
solveBtn.addEventListener("click", solveMaze);

createGrid();
