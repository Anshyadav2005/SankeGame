const board = document.querySelector(".board");
const scoreElement = document.querySelector(".score");
const timeElement = document.querySelector(".time");
const highScoreElement = document.querySelector(".high-score");
const lastScore = document.querySelector("#last-score");
const startButton = document.querySelector(".btn-start");
const restatButton = document.querySelector(".btn-restart");
const modal = document.querySelector(".modal");
const gameover = document.querySelector(".game-over");
const startgame = document.querySelector(".start-game");

// height or width of board
const height = 30;
const width = 30;
const cols = Math.floor(board.clientWidth / width);
const rows = Math.floor(board.clientHeight / height);

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = "00-00";

highScoreElement.textContent = highScore;

const blocks = [];
// snake cordinates
let snake = [{ x: 1, y: 3 }];

let intervalId = null;

// random food location
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

let direction = "right";

// create blocks acc to height or width of screen

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);

    // block.innerHTML = `${row},${col}`;

    blocks[`${row},${col}`] = block;
  }
}

// A function handle direction ,move snake spone food after eat , increase snak height .

function render() {
  let head = null;

  // food color
  blocks[`${food.x},${food.y}`].classList.add("food");

  // handle snake direction
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  //  food comsume logic ,and snake size increase
  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x},${food.y}`].classList.remove("food");

    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x},${food.y}`].classList.add("food");
    snake.unshift(head);

    score += 10;
    scoreElement.textContent = score;

    // high score store

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());

      highScoreElement.textContent = highScore;
    }
  }

  // game over due to touch the wall
  if (head.x < 0 || head.y < 0 || head.y >= cols || head.x >= rows) {
    clearInterval(intervalId);

    gameover.style.display = "flex";
    modal.style.display = "flex";
    startgame.style.display = "none";

    lastScore.innerText = `${score}`;

    return;
  }

  // snake movment
  snake.forEach((segment) => {
    blocks[`${segment.x},${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    blocks[`${segment.x},${segment.y}`].classList.add("fill");
  });
}

// move snake by using keys
addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    direction = "up";
  } else if (event.key === "ArrowDown") {
    direction = "down";
  } else if (event.key === "ArrowLeft") {
    direction = "left";
  } else if (event.key === "ArrowRight") {
    direction = "right";
  }
});

startButton.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 300);

  const timeIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);

    if (sec == 59) {
      min += 1;
      sec = 0;
    } else sec += 1;

    time = `${min}-${sec}`;
    timeElement.textContent = time;
  }, 1000);
});

restatButton.addEventListener("click", () => {
  blocks[`${food.x},${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x},${segment.y}`].classList.remove("fill");
  });

  direction = "down";
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  snake = [{ x: 1, y: 3 }];

  score = 0;
  time = 0;

  scoreElement.textContent = score;
  time.innerText = time;

  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 300);
});
