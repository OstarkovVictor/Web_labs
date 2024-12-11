// Получение элементов DOM
const canvas = document.getElementById('lifeCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const clearBtn = document.getElementById('clearBtn');
const speedSlider = document.getElementById('speedSlider');
const gridSizeInput = document.getElementById('gridSizeInput');

// Глобальные переменные
let cellSize = 10; // Размер клетки
let gridSize = parseInt(gridSizeInput.value, 10); // Количество клеток на стороне
let grid = []; // Текущее состояние игрового поля
let running = false; // Флаг запуска симуляции
let speed = parseInt(speedSlider.value, 100); // Скорость игры
let animationFrame;

// Инициализация игрового поля
function setupCanvas() {
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
    grid = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => false)
    );
}

// Отрисовка сетки и клеток
function paintGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ccc';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
            if (grid[i][j]) {
                ctx.fillStyle = '#00FF7B';
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Подсчёт соседей клетки
function countNeighbors(x, y) {
    let neighbors = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const nx = (x + dx + gridSize) % gridSize;
            const ny = (y + dy + gridSize) % gridSize;
            if (grid[nx][ny]) neighbors++;
        }
    }
    return neighbors;
}

// Обновление состояния игрового поля
function updateGrid() {
    const newGrid = grid.map((row, x) =>
        row.map((cell, y) => {
            const neighbors = countNeighbors(x, y);
            if (cell) {
                return neighbors === 2 || neighbors === 3;
            } else {
                return neighbors === 3;
            }
        })
    );
    grid = newGrid;
}

// Запуск симуляции
function startSimulation() {
    running = true;
    function step() {
        updateGrid();
        paintGrid();
        if (running) {
            animationFrame = setTimeout(step, 1000 / speed);
        }
    }
    step();
}

// Остановка симуляции
function stopSimulation() {
    running = false;
    clearTimeout(animationFrame);
}

// Очистка игрового поля
function clearGrid() {
    stopSimulation();
    setupCanvas();
    paintGrid();
}

// Управление мышью для включения/выключения клеток
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    grid[x][y] = !grid[x][y];
    paintGrid();
});

// Обновление параметров
gridSizeInput.addEventListener('change', () => {
    gridSize = parseInt(gridSizeInput.value, 10);
    setupCanvas();
    paintGrid();
});

speedSlider.addEventListener('input', () => {
    speed = parseInt(speedSlider.value, 10);
});

// Привязка кнопок
startBtn.addEventListener('click', () => {
    if (running) {
        stopSimulation();
        startBtn.textContent = 'Старт';
    } else {
        startSimulation();
        startBtn.textContent = 'Стоп';
    }
});

clearBtn.addEventListener('click', clearGrid);

// Начальная настройка
setupCanvas();
paintGrid();