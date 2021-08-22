var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

const gameFieldSize = 10;
const gameFieldArea = gameFieldSize * gameFieldSize;
const blockSize = canvas.width / gameFieldSize;
const speed = 5;

const snakeColor = 'rgb(200, 0, 0)';
const foodColor = 'rgba(0, 0, 200, 0.5)';

var snakeDirection = { x: 1, y: 0 }
var snakePosition = [{ x: 1, y: 0 }, { x: 0, y: 0 }]
var snakeLength = 2

var foodMap = [...Array(gameFieldSize)].map(() => [])
var snakeMap = [...Array(gameFieldSize)].map(() => [])


var gameLoop;


function drawBlock(p, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
        p.x * blockSize, p.y * blockSize,
        blockSize, blockSize);
}

function clearBlock(p) {
    ctx.clearRect(
        p.x * blockSize, p.y * blockSize,
        blockSize, blockSize);
}

function onBorders(p) {
    return p.x < 0 || p.y < 0 || p.x > gameFieldSize || p.y > gameFieldSize;
}

function moveSnake() {
    // clear tail if needed
    if (snakePosition.length == snakeLength) {
        let tail = snakePosition[snakeLength - 1]
        clearBlock(tail)
        snakeMap[tail.x][tail.y] = false
        snakePosition.pop()
    }

    // set new head
    snakePosition.unshift({
        x: snakePosition[0].x + snakeDirection.x,
        y: snakePosition[0].y + snakeDirection.y
    })
    let head = snakePosition[0]

    // handle colizions
    if (onBorders(head) || snakeMap[head.x][head.y]) {
        clearInterval(gameLoop)
        alert('Game Over!')
    }

    drawBlock(snakePosition[0], snakeColor)
    snakeMap[head.x][head.y] = true

    // handle food
    if (foodMap[head.x][head.y]) {
        foodMap[head.x][head.y] = false;
        snakeLength++;
    }
}

function spawnFood() {
    if (Math.random() > 0.9 + 0.1 * snakeLength / gameFieldArea) {
        let rand, x, y;
        do {
            rand = Math.floor(Math.random() * gameFieldArea);
            x = ~~(rand / gameFieldSize);
            y = rand % gameFieldSize;
        } while (foodMap[x][y] || snakeMap[x][y])
        foodMap[x][y] = true;
        drawBlock({ x: x, y: y }, foodColor)
    }
}

function animate() {
    moveSnake()
    spawnFood()
}

function initGame() {
    drawBlock(snakePosition[1], snakeColor);
    drawBlock(snakePosition[0], snakeColor);

    document.addEventListener('keydown', onKeyDown, false);

    gameLoop = setInterval(animate, 1000 / speed);
}

function onKeyDown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            snakeDirection = {
                x: !snakeDirection.x * snakeDirection.y,
                y: !snakeDirection.y * snakeDirection.x * -1
            }
            return;

        case 'ArrowRight':
            snakeDirection = {
                x: !snakeDirection.x * snakeDirection.y * -1,
                y: !snakeDirection.y * snakeDirection.x
            }
            return;
    }
}

initGame()
