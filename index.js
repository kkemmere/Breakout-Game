const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const scoreSpan = document.querySelector('#scoreSpan');
const winSpan = document.querySelector('#winSpan');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let score = 0;
let wins = 0;

const player = {
    x: 270,
    y: 360,
    w: 70, 
    h: 15,
    dx: 5,
}

const ball = {
    x: 305,
    y: 350,
    radius: 7,
    dx: 1,
    dy: 1,
}

const bricks = {
    rows: 5,
    cols: 8,
}

const brick = {
    w: 55,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 50,
    visible: true,
}

let numBricks = bricks.rows * bricks.cols;

const bricksArr = [];

for (let i = 0; i < bricks.cols; i++)
{
    bricksArr[i] = [];

    for (let j = 0; j < bricks.rows; j++)
    {
        const x = i * (brick.w + brick.padding) + brick.offsetX;
        const y = j * (brick.h + brick.padding) + brick.offsetY;

        bricksArr[i][j] = {
            x, 
            y, 
            ...brick,
        }
    }
}


function game() {
    update();
    render();
    requestAnimationFrame(game);
}
requestAnimationFrame(game);


// Events

let playerDirection = " ";

document.addEventListener('keydown', (e) => {
    if(e.keyCode === 65 || e.keyCode === 37) playerDirection = "left";
    if(e.keyCode === 68 || e.keyCode === 39) playerDirection = "right";
})
document.addEventListener('keyup', (e) => {
    if(e.keyCode === 65 || e.keyCode === 37) playerDirection = "";
    if(e.keyCode === 68 || e.keyCode === 39) playerDirection = "";
})

function movePlayer() {
    if(playerDirection === "left") player.x -= player.dx;
    if(playerDirection === "right") player.x += player.dx;

    if(player.x <= 0) player.x = 0;
    if(player.x >= 600 - player.w) player.x = 600 - player.w;

}

function moveBall() {
    ball.x += ball.dx;
    ball.y -= ball.dy;

    if(ball.x + ball.radius >= 600 || ball.x <= ball.radius) ball.dx = -ball.dx;
    if(ball.y <= 0 || ball.y + ball.radius >= 400) ball.dy = -ball.dy;
    
    if (ball.x + ball.radius > player.x
        && ball.x <= player.x + player.w
        && ball.y + ball.radius >= player.y){
            ball.dy = -ball.dy;
        }

        bricksArr.forEach((col) => {
            col.forEach((brick) => {
              if (brick.visible === true) {
                brickCollision(brick);
              }
            })
        })
}

function brickCollision(brick) {
    if (ball.x >= brick.x 
        && ball.x + ball.radius<= brick.x + brick.w
        && ball.y + ball.radius >= brick.y 
        && ball.y <= brick.y + brick.h) {
            ball.dy = -ball.dy;
            brick.visible = false;

            numBricks--;
            updateScore();
        }
}

function updateScore() {
    scoreSpan.innerHTML = "";
    score++;
    scoreSpan.innerHTML = score;
}

function updateWins() {
    winSpan.innerHTML = "";
    wins++;
    winSpan.innerHTML = wins;
}

function handleWin() {
    if(numBricks <= 0)
    {
        updateWins();
        alert("You Won");
        numBricks = bricks.cols * bricks.rows;
        localStorage.reload();
        location.reload();
        score === 0;
    }
}

function handleLoss() {
    if (ball.y + ball.radius >= 400) {
        location.reload();
    }
}


function update() {
    movePlayer();
    moveBall();
    handleLoss();
    handleWin();
}

// Render methods

function renderPlayer() {
    context.beginPath();

    context.rect(player.x, player.y, player.w, player.h, player.dx);
    context.fillStyle = "cyan";
    context.fill();

    context.closePath();
}

function renderBall() {
    context.beginPath();

    context.arc(ball.x,ball.y,ball.radius,0,2*Math.PI);
    context.fillStyle = "cyan",
    context.fill();

    context.closePath();
}

function renderBricks() {
    bricksArr.forEach((cols) => {
        cols.forEach((brick) => {
            context.beginPath();
            context.rect(brick.x, brick.y, brick.w, brick.h);
            context.fillStyle = brick.visible ? "#C21A70" : "transparent";
            context.fill();
            context.closePath();
        })
    })
}

function render() {
    context.clearRect(0,0, canvas.width, canvas.height);

    renderPlayer();
    renderBall();
    renderBricks();
}