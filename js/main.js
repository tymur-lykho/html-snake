const canvas = document.getElementById("game-window");
const points = document.getElementById("points");
const ctx = canvas.getContext("2d");

let gameMode = 'INFINITY';//INFINITY, WALLS
let infinityLife = true;

let curentSnakeSize = 5;

let eatCoordinate = [];

let moveDirection = 'RIGHT';

let isGameStart = true;

let areaWidth = 40; //20
let areaHeight = 40; //20
let areaSegmentSize = 10; //20


let snakeArray = setDefaultSnake();

function setDefaultSnake(){
	let snake = [];
	const startCoordinateX = Number.parseInt(areaWidth / 2);
	const startCoordinateY = Number.parseInt(areaHeight / 2);
	for (let i = 0; i < 5; i += 1){
		const segment = [startCoordinateX - i, startCoordinateY]
		snake.push(segment);
	}
	return snake;
}

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
	let color = "rgb(160, 160, 160)";
	let currentColor = "";
	for (let i = 0; i < areaHeight * areaSegmentSize; i += areaSegmentSize){
		if (((i / areaSegmentSize) % areaSegmentSize) % 2 === 1) {
			currentColor = color;
		} else {
			currentColor = "rgb(105, 104, 104)";
		}
		for (let j = 0; j < areaWidth * areaSegmentSize; j += areaSegmentSize){
			if (color === currentColor) {
				currentColor = "rgb(105, 104, 104)";
			} else {
				currentColor = color;
			}
			ctx.fillStyle = currentColor;
			ctx.fillRect(i, j, areaSegmentSize, areaSegmentSize);
		}
	}
}

function drawSnake() {
	let snakeColor = "rgb(34, 143, 1)";
	let currentSnakeColor = "";
	let snakeSegmentCounter = 0;
	for (const snakeSegment of snakeArray) {
		let snakeSegmentX = snakeSegment[0];
		let snakeSegmentY = snakeSegment[1];
		if (snakeSegmentCounter < 1) {
			currentSnakeColor = "rgb(11, 44, 1)";
		} else {
			currentSnakeColor = snakeColor;
			// if (snakeSegmentCounter % 2) {
			// 	currentSnakeColor = snakeColor;
			// } else {
			// 	currentSnakeColor = "rgb(43, 173, 3)";
			// }
		}
		snakeSegmentCounter += 1;
		ctx.fillStyle = currentSnakeColor;
		ctx.fillRect(snakeSegmentX * areaSegmentSize, snakeSegmentY * areaSegmentSize, areaSegmentSize, areaSegmentSize);
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
						newHead = [head[0], head[1] + areaWidth - 1];
						break;
					case 'DOWN':
						newHead = [head[0], head[1] - areaHeight + 1];
						break;
					case 'LEFT':
						newHead = [head[0] + areaWidth - 1, head[1]];
						break;
					case 'RIGHT':
						newHead = [head[0] - areaHeight + 1 , head[1]];
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
		pointCounter();
	} else {
		snakeArray.unshift(newHead);
    snakeArray.pop();
	}

  drawArea();
	drawSnake();
	drawEat();
}

function isOutOfBounds(head) {
  return head[0] < 0 || head[1] < 0 || head[0] >= areaWidth || head[1] >= areaHeight;
}

function isHitTheSnake(head) {
	if (infinityLife) {
		return false;
	} else {
		for (let segment of snakeArray) {
			if (segment[0] === head[0] && segment[1] === head[1]) {
				return true;
			}
		}
		return false;
	}
}

function isEating(head, eat) {
	return head[0] === eat[0] && head[1] === eat[1];
}

function pointCounter(){
	let currentPoints = Number(points.textContent);
	currentPoints += 1;
	points.textContent = String(currentPoints).padStart(4, "0");
}

function drawEat() {
	if (eatCoordinate.length === 0) {
		eatCoordinate = getRandomCoordinate();
	}
	const eatColor = "rgb(255, 0, 0)";
	const eatCoordinateX = eatCoordinate[0] * areaSegmentSize;
	const eatCoordinateY = eatCoordinate[1] * areaSegmentSize;
	ctx.fillStyle = eatColor;
	ctx.fillRect(eatCoordinateX, eatCoordinateY, areaSegmentSize, areaSegmentSize);
}

function getRandomCoordinate() {
	const max = areaWidth;
	let randomCoordinate;
  do {
    randomCoordinate = [Math.floor(Math.random() * max), Math.floor(Math.random() * max)];
  } while (snakeArray.some(segment => segment[0] === randomCoordinate[0] && segment[1] === randomCoordinate[1]));
  return randomCoordinate;
}

document.addEventListener('keydown', (e) => {
  handleDirectionChange(e.key);
});

document.getElementById('btn-pause').addEventListener('click', () => handleDirectionChange(' '));
document.getElementById('btn-reload').addEventListener('click', () => handleDirectionChange('Enter'));
document.getElementById('btn-up').addEventListener('click', () => handleDirectionChange('ArrowUp'));
document.getElementById('btn-down').addEventListener('click', () => handleDirectionChange('ArrowDown'));
document.getElementById('btn-left').addEventListener('click', () => handleDirectionChange('ArrowLeft'));
document.getElementById('btn-right').addEventListener('click', () => handleDirectionChange('ArrowRight'));

function handleDirectionChange(key) {
	const pauseButton = document.getElementById('btn-pause');
	const pauseIcon = pauseButton.querySelector('use');
	switch (key) {
		case ' ':
			isGameStart = isGameStart ? false : true; 
			if (isGameStart) {
				pauseIcon.setAttribute('href', './img/sprite.svg#pause');
				requestAnimationFrame(gameLoop);
			} else {
				pauseIcon.setAttribute('href', './img/sprite.svg#play');
			}
			break;
		case 'Enter':
			isGameStart = true; 
			pauseIcon.setAttribute('href', './img/sprite.svg#pause');
			requestAnimationFrame(gameLoop);
			snakeArray = setDefaultSnake();
			points.textContent = String('0').padStart(4, "0");
			eatCoordinate = [];
			break;
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
} 
