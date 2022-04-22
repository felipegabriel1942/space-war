const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

const spaceshipHeight = 40;
const spaceshipWidth = 40;

let spaceshipX = (canvas.width - spaceshipWidth) / 2;

var rightPressed = false;
var leftPressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function drawSpaceship() {
  let img = document.createElement('img');
  img.src = './assets/images/player.png';

  ctx.drawImage(
    img,
    spaceshipX,
    canvas.height - spaceshipHeight,
    spaceshipHeight,
    spaceshipWidth
  );
}

function keyDownHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = true;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = false;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSpaceship();

  if (rightPressed) {
    spaceshipX += 7;
  } else if (leftPressed) {
    spaceshipX -= 7;
  }
}

setInterval(draw, 10);
