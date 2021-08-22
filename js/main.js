var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

const gameFieldSize = 10;
const blockSize = canvas.width / gameFieldSize;
const speed = 5;

const snakeColor = 'rgb(200, 0, 0)';
const foodColor = 'rgba(0, 0, 200, 0.5)';

var snakeDirection = { x: 0, y: 0 };
var snakePosition = [{
    x: ~~(gameFieldSize / 2),
    y: ~~(gameFieldSize / 2)
}];
var snakeLength = 2;

var snakeMap = [];
for (let i = 0; i < gameFieldSize; ++i) {
    snakeMap.push([]);
}
snakeMap[snakePosition[0].x][snakePosition[0].y] = true;

var foodPosition = { x: 0, y: 0 };


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

const onBorders = (p) =>
    p.x < 0 || p.y < 0 || p.x > gameFieldSize || p.y > gameFieldSize;

function moveSnake() {
    // clear tail if needed
    if (snakePosition.length == snakeLength) {
        let tail = snakePosition[snakeLength - 1];
        clearBlock(tail);
        snakeMap[tail.x][tail.y] = false;
        snakePosition.pop();
    }

    // set new head
    snakePosition.unshift({
        x: snakePosition[0].x + snakeDirection.x,
        y: snakePosition[0].y + snakeDirection.y
    });
    let head = snakePosition[0];

    // handle colizions
    if (onBorders(head) || snakeMap[head.x][head.y]) {
        clearInterval(gameLoop);
        alert('Game Over!');
        return;
    }

    drawBlock(snakePosition[0], snakeColor);
    snakeMap[head.x][head.y] = true;

    // handle food
    if (foodPosition.x == head.x && foodPosition.y == head.y) {
        snakeLength++;
        spawnFood();
    }
}

function spawnFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gameFieldSize);
        y = Math.floor(Math.random() * gameFieldSize);
    } while (snakeMap[x][y])
    foodPosition = { x: x, y: y };
    drawBlock(foodPosition, foodColor);
}

function initGame() {
    // select random direction
    let x = Math.floor(Math.random()), y = Math.floor(Math.random()) * 2 - 1;
    snakeDirection.x = x * y;
    snakeDirection.y = !x * y;

    // create and draw snake
    snakePosition.push({
        x: snakePosition[0].x + snakeDirection.x * -1,
        y: snakePosition[0].y + snakeDirection.y * -1
    });
    snakeMap[snakePosition[1].x][snakePosition[1].y] = true;
    drawBlock(snakePosition[1], snakeColor);
    drawBlock(snakePosition[0], snakeColor);

    spawnFood();

    document.addEventListener('keydown', onKeyDown, false);

    gameLoop = setInterval(moveSnake, 1000 / speed);
}

function onKeyDown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            snakeDirection = {
                x: !snakeDirection.x * snakeDirection.y,
                y: !snakeDirection.y * snakeDirection.x * -1
            };
            return;

        case 'ArrowRight':
            snakeDirection = {
                x: !snakeDirection.x * snakeDirection.y * -1,
                y: !snakeDirection.y * snakeDirection.x
            };
            return;
    }
}

initGame();
