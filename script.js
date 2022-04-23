const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

const spaceshipHeight = 40;
const spaceshipWidth = 40;

let xSpeed = (canvas.width - spaceshipWidth) / 2;

var rightPressed = false;
var leftPressed = false;

let img = document.createElement('img');
img.src = './assets/images/player.png';

// document.addEventListener('keydown', keyDownHandler, false);
// document.addEventListener('keyup', keyUpHandler, false);

function drawSpaceship(keys) {
  if (keys.ArrowRight) {
    xSpeed += playerXSpeed;
  } else if (keys.ArrowLeft) {
    xSpeed -= playerXSpeed;
  }

  ctx.drawImage(
    img,
    xSpeed,
    canvas.height - spaceshipHeight,
    spaceshipHeight,
    spaceshipWidth
  );
}

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
    this.imgSrc = './assets/images/player.png';
  }

  get type() {
    return 'player';
  }

  static create() {
    return new Player();
  }
}

const playerXSpeed = 3;

Player.prototype.update = function (keys) {
  let xSpeed = 0;

  if (rightPressed) {
    xSpeed += playerXSpeed;
  } else if (leftPressed) {
    xSpeed -= playerXSpeed;
  }

  let img = document.createElement('img');
  img.src = this.imgSrc;

  ctx.drawImage(
    img,
    xSpeed,
    canvas.height - spaceshipHeight,
    spaceshipHeight,
    spaceshipWidth
  );

  return new Player();
};

function trackKeys(keys) {
  let pressed = Object.create(null);

  function track(event) {
    if (keys.includes(event.key)) {
      pressed[event.key] = event.type == 'keydown';
      event.preventDefault();
    }
  }

  window.addEventListener('keydown', track);
  window.addEventListener('keyup', track);

  return pressed;
}

function draw(keys) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSpaceship(keys);

  // new Player().update();
}

// TODO: Verificar se existe necessidade para a lógica contida nessa função
function runAnimation(frameFunc) {
  let lastTime = null;

  function frame(time) {
    if (lastTime != null) {
      let timeStep = 1000;

      if (frameFunc(timeStep) == false) {
        return;
      }
    }

    lastTime = time;

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function runLevel() {
  return new Promise((resolve) => {
    const animate = (time) => {
      draw(arrowKeys);
    };

    let arrowKeys = trackKeys(['ArrowLeft', 'ArrowRight']);

    runAnimation(animate);
  });
}

async function runGame() {
  await runLevel();
}

runGame();
