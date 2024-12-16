// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const boxSize = 30;
let snake = [{ x: 300, y: 300 }];
let food = { x: 0, y: 0 };
let dx = 0;
let dy = 0;

// Generate random coordinates for the food
function generateFood() {
  const maxCoord = Math.floor(canvas.width / boxSize) - 1;
  food.x = Math.floor(Math.random() * maxCoord) * boxSize;
  food.y = Math.floor(Math.random() * maxCoord) * boxSize;
}

// Handle keyboard input
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;
  const A_KEY = 65;
  const D_KEY = 68;
  const W_KEY = 87;
  const S_KEY = 83;

  const keyPressed = event.keyCode;

  if (keyPressed === LEFT_KEY || keyPressed === A_KEY) {
    if (dx !== boxSize) {
      dx = -boxSize;
      dy = 0;
    }
  }

  if (keyPressed === RIGHT_KEY || keyPressed === D_KEY) {
    if (dx !== -boxSize) {
      dx = boxSize;
      dy = 0;
    }
  }

  if (keyPressed === UP_KEY || keyPressed === W_KEY) {
    if (dy !== boxSize) {
      dx = 0;
      dy = -boxSize;
    }
  }

  if (keyPressed === DOWN_KEY || keyPressed === S_KEY) {
    if (dy !== -boxSize) {
      dx = 0;
      dy = boxSize;
    }
  }
}

// Game loop
function gameLoop() {
  clearCanvas();
  moveSnake();
  drawSnake();
  drawFood();

  // Check for collision with food
  if (snake[0].x === food.x && snake[0].y === food.y) {
    snake.push({ x: snake[0].x + dx, y: snake[0].y + dy });
    generateFood();
  }

  // Check for collision with boundaries or self
  if (
    snake[0].x < 0 ||
    snake[0].x >= canvas.width ||
    snake[0].y < 0 ||
    snake[0].y >= canvas.height ||
    collisionWithSelf()
  ) {
    gameOver();
    return;
  }

  requestAnimationFrame(gameLoop);
}

// Function to clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to move the snake
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  snake.pop();
}

// Function to draw the snake
function drawSnake() {
  snake.forEach((segment, index) => {
    const neonColors = ['#ff00ff', '#00ffff', '#ffff00'];
    const colorIndex = index % neonColors.length;
    const segmentColor = neonColors[colorIndex];

    ctx.fillStyle = segmentColor;
    ctx.beginPath();
    ctx.arc(
      segment.x + boxSize / 2,
      segment.y + boxSize / 2,
      boxSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// Function to draw the food
function drawFood() {
  ctx.fillStyle = '#ff00ff'; // Neon pink color
  ctx.beginPath();
  ctx.arc(
    food.x + boxSize / 2,
    food.y + boxSize / 2,
    boxSize / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// Function to check collision with self
function collisionWithSelf() {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

// Function to end the game
function gameOver() {
  clearCanvas();
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
}

// Reset button functionality
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetGame);

function resetGame() {
  snake = [{ x: 300, y: 300 }];
  dx = 0;
  dy = 0;
  generateFood();
}

// Initialize the game
generateFood();
gameLoop();
