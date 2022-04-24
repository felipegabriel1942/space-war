const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

const spaceshipHeight = 40;
const spaceshipWidth = 40;

let playerElement = document.createElement('img');
playerElement.src = './assets/images/player.png';

let projectileElement = document.createElement('img');
projectileElement.src = './assets/images/laserBlue03.png';
class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Level {
  constructor() {
    this.gameObjects = [];
    this.gameObjects.push(Player.create());
  }
}

class State {
  constructor(level, gameObjects, status) {
    this.level = level;
    this.gameObjects = gameObjects;
    this.status = status;
  }

  static start(level) {
    return new State(level, level.gameObjects, 'playing');
  }

  get player() {
    return this.gameObjects.find((o) => o.type == 'player');
  }
}

State.prototype.update = function (time, keys) {
  console.log(this.gameObjects);
  let gameObjects = this.gameObjects.map((gameObject) =>
    gameObject.update(this, keys)
  );

  if (keys[' ']) {
    gameObjects.push(Projectile.create());
  }

  return new State(this.level, gameObjects, this.status);
};

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
    return new Player(
      new Vec((canvas.width - spaceshipWidth) / 2, canvas.height - 40),
      (canvas.width - spaceshipWidth) / 2
    );
  }
}

const playerXSpeed = 3;

Player.prototype.update = function (state, keys) {
  let xSpeed = state.player.speed;

  if (keys.ArrowRight) {
    xSpeed += playerXSpeed;
  } else if (keys.ArrowLeft) {
    xSpeed -= playerXSpeed;
  }

  // TODO: Deve ser movido pra outro local.
  // Está aumentando a responsabilidade da função
  ctx.drawImage(
    playerElement,
    xSpeed,
    canvas.height - spaceshipHeight,
    spaceshipHeight,
    spaceshipWidth
  );

  return new Player(
    new Vec((canvas.width - spaceshipWidth) / 2, canvas.height - 40),
    xSpeed
  );
};

class Projectile {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
    this.imgSrc = './assets/images/laserBlue03.png';
  }

  get type() {
    return 'projectile';
  }

  static create(state) {
    return new Projectile(
      new Vec((canvas.width - spaceshipWidth) / 2, canvas.height - 40),
      5
    );
  }
}

Projectile.prototype.update = function (state) {
  ctx.drawImage(projectileElement, 5, canvas.height - spaceshipHeight, 5, 30);

  return new Projectile(
    new Vec((canvas.width - spaceshipWidth) / 2, canvas.height - 40),
    5
  );
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

  // drawSpaceship(keys);

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

function runLevel(level) {
  let state = State.start(level);
  console.log(state);

  return new Promise((resolve) => {
    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      state = state.update(time, arrowKeys);
      // draw(level);
    };

    let arrowKeys = trackKeys(['ArrowLeft', 'ArrowRight', ' ']);

    runAnimation(animate);
  });
}

async function runGame() {
  const level = new Level();
  await runLevel(level);
}

runGame();
