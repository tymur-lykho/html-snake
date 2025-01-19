const canvas = document.getElementById("tutorial");
const ctx = canvas.getContext("2d");

let gameMode = 'INFINITY';//INFINITY, WALLS

let curentSnakeSize = 5;
const snakeArray = [[9, 9], [9, 10], [9, 11], [9, 12], [9, 13]]

let eatCoordinate = [];

let moveDirection = 'RIGHT';

let isGameStart = true;

const delay = 250;
let lastTime = 0;
function gameLoop(timestamp) {
	if (isGameStart) {
		if (timestamp - lastTime > delay) {
			moveSnake();
			lastTime = timestamp;
		}
		requestAnimationFrame(gameLoop);
	} else {
		console.log("Game loop stopped");
    return;
	}
}

requestAnimationFrame(gameLoop);

function drawArea() {
	let color = "rgb(100, 100, 100)";
	let currentColor = "";
	for (let i = 0; i < 400; i += 20){
		if (((i / 20) % 20) % 2 === 1) {
			currentColor = color;
		} else {
			currentColor = "rgb(63, 63, 63)";
		}
		for (let j = 0; j < 400; j += 20){
			if (color === currentColor) {
				currentColor = "rgb(63, 63, 63)";
			} else {
				currentColor = color;
			}
			ctx.fillStyle = currentColor;
			ctx.fillRect(i, j, 20, 20);
		}
	}
}

function drawSnake() {
	let snakeColor = "rgb(40, 156, 4)";
	let currentSnakeColor = "";
	let snakeSegmentCounter = 0;
	for (const snakeSegment of snakeArray) {
		let snakeSegmentX = snakeSegment[0];
		let snakeSegmentY = snakeSegment[1];
		if (snakeSegmentCounter < 1) {
			currentSnakeColor = "rgb(11, 44, 1)";
		} else {
			if (snakeSegmentCounter % 2) {
				currentSnakeColor = snakeColor;
			} else {
				currentSnakeColor = "rgb(45, 182, 4)";
			}
		}
		snakeSegmentCounter += 1;
		ctx.fillStyle = currentSnakeColor;
		ctx.fillRect(snakeSegmentX * 20, snakeSegmentY * 20, 20, 20);
	}
}

function moveSnake() {
  let head = snakeArray[0];
  let newHead;

  switch (moveDirection) {
    case 'UP':
      newHead = [head[0], head[1] - 1];
      break;
    case 'DOWN':
      newHead = [head[0], head[1] + 1];
      break;
    case 'LEFT':
      newHead = [head[0] - 1, head[1]];
      break;
    case 'RIGHT':
      newHead = [head[0] + 1, head[1]];
      break;
	}
	
	if (isOutOfBounds(newHead)) {
		switch (gameMode){
			case 'WALLS':
				isGameStart = false;
				alert("Game Over! The snake hit the wall.");
				return;
			case 'INFINITY':
				switch (moveDirection) {
					case 'UP':
						newHead = [head[0], head[1] + 19];
						break;
					case 'DOWN':
						newHead = [head[0], head[1] - 19];
						break;
					case 'LEFT':
						newHead = [head[0] + 19, head[1]];
						break;
					case 'RIGHT':
						newHead = [head[0] - 19, head[1]];
						break;
				}
		}
	}
	
	if (isHitTheSnake(newHead)) {
		isGameStart = false;
		alert("Game Over! The snake hit the snake.");
		return;
	}

	if (isEating(newHead, eatCoordinate)) {
		snakeArray.unshift(newHead);
    eatCoordinate = [];
	} else {
		snakeArray.unshift(newHead);
    snakeArray.pop();
	}

  drawArea();
	drawSnake();
	drawEat();
}

function isOutOfBounds(head) {
  return head[0] < 0 || head[1] < 0 || head[0] >= 20 || head[1] >= 20;
}

function isHitTheSnake(head) {
	for (let segment of snakeArray) {
    if (segment[0] === head[0] && segment[1] === head[1]) {
      return true;
    }
  }
  return false;
}

function isEating(head, eat) {
	return head[0] === eat[0] && head[1] === eat[1];
}

function drawEat() {
	if (eatCoordinate.length === 0) {
		eatCoordinate = getRandomCoordinate();
	}
	const eatColor = "rgb(255, 0, 0)";
	const eatCoordinateX = eatCoordinate[0] * 20;
	const eatCoordinateY = eatCoordinate[1] * 20;
	ctx.fillStyle = eatColor;
	ctx.fillRect(eatCoordinateX, eatCoordinateY, 20, 20);
}

function getRandomCoordinate() {
	const max = 20;
	let randomCoordinate;
  do {
    randomCoordinate = [Math.floor(Math.random() * max), Math.floor(Math.random() * max)];
  } while (snakeArray.some(segment => segment[0] === randomCoordinate[0] && segment[1] === randomCoordinate[1]));
  return randomCoordinate;
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
		case 'ArrowUp':
      if (moveDirection !== 'DOWN') moveDirection = 'UP';
      break;
    case 'ArrowDown':
      if (moveDirection !== 'UP') moveDirection = 'DOWN';
      break;
    case 'ArrowLeft':
      if (moveDirection !== 'RIGHT') moveDirection = 'LEFT';
      break;
    case 'ArrowRight':
      if (moveDirection !== 'LEFT') moveDirection = 'RIGHT';
      break;
  }
});

