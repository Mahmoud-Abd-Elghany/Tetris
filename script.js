import shapes, { width } from "./shapes.mjs";
import { Queue } from "./queue.js";

const grid = document.querySelector(".grid");
const nextGrid = document.querySelector(".next-grid");
const scoreBoard = document.querySelectorAll(".score");
const gameOverBoard = document.querySelector(".gameOver-board");
const startPause = document.querySelector("#start-pause");
const startOver = document.querySelector("#start-over");
let score = 0;
let currentQueue = new Queue();
let current;
let state = 0;
const firstShape = Math.floor(Math.random() * shapes.length);
console.log(scoreBoard)

//Grids Settup
for (let i = 0; i < 210; i++) {
  let element = document.createElement("div");
  element.classList.add("grid-block");
  if (i > 0 && i < 10) {
    element.classList.add("top");
  }
  if (i >= 200) {
    element.classList.add("taken", "hidden");
  }
  grid.appendChild(element);
}
for (let i = 0; i < 16; i++) {
  let element = document.createElement("div");
  element.classList.add("grid-block");
  nextGrid.appendChild(element);
}

let gridArr = Array.from(document.querySelectorAll(".grid div"));
const nextGridArr = Array.from(document.querySelectorAll(".next-grid div"));
let positionX = Math.floor(Math.random() * 8);
let positionY = 0;

// Getters and Setters
const getCurrentRotation = () => {
  return currentQueue.elements[currentQueue.head].rotation;
};
const getCurrentShape = () => {
  return currentQueue.elements[currentQueue.head].shape;
};

const changeCurrentRotation = (newValue) => {
  currentQueue.elements[currentQueue.head].rotation = newValue;
};

const generateShape = () => {
  let randomShape = Math.floor(Math.random() * shapes.length);
  let randomRotation = Math.floor(Math.random() * shapes[randomShape].length);
  return {
    shape: randomShape,
    rotation: randomRotation,
  };
};

currentQueue.enqueue({
  shape: firstShape,
  rotation: Math.floor(Math.random() * shapes[firstShape].length),
});

currentQueue.enqueue(generateShape());
let nextInQueue = currentQueue.elements[currentQueue.head + 1];

const setCurrent = () => {
  current = shapes[getCurrentShape()][getCurrentRotation()];
};
setCurrent();

//Draw and Generation functions
const draw = () => {
  current.forEach((square) => {
    gridArr[square + positionX + width * positionY].classList.add("active");
  });
};

const drawNext = () => {
  shapes[nextInQueue.shape][nextInQueue.rotation].forEach((square) => {
    if (square >= 10 && square < 20) {
      nextGridArr[square - 10 + 4].classList.add("active");
    } else if (square >= 20 && square < 30) {
      nextGridArr[square - 20 + 8].classList.add("active");
    } else if (square >= 30 && square < 40) {
      nextGridArr[square - 30 + 12].classList.add("active");
    } else {
      nextGridArr[square].classList.add("active");
    }
  });
};
const unDrawNext = () => {
  shapes[nextInQueue.shape][nextInQueue.rotation].forEach((square) => {
    if (square >= 10 && square < 20) {
      nextGridArr[square - 10 + 4].classList.remove("active");
    } else if (square >= 20 && square < 30) {
      nextGridArr[square - 20 + 8].classList.remove("active");
    } else if (square >= 30 && square < 40) {
      nextGridArr[square - 30 + 12].classList.remove("active");
    } else {
      nextGridArr[square].classList.remove("active");
    }
  });
};

const undraw = () => {
  current.forEach((element) => {
    gridArr[element + positionX + width * positionY].classList.remove("active");
  });
};

const nextShape = () => {
  currentQueue.dequeue();
  currentQueue.enqueue({ ...generateShape() });
  let latestShape = currentQueue.peek();
  current = shapes[latestShape.shape][latestShape.rotation];
  nextInQueue = { ...currentQueue.elements[currentQueue.head + 1] };
  return current;
};

//Event Functions

document.addEventListener("keydown", (e) => {
  if (state) {
    undraw();
    unDrawNext();
    switch (e.key) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowDown":
        moveDown();
        break;
      case "z":
        rotateLeft();
        break;
      case "x":
        rotateRight();
        break;
    }
    checkCycle();
  }
});

let timer;

//start pause function
startPause.addEventListener("click", () => {
  if (state) {
    clearInterval(timer);
    timer = null;
    state = 0;
    startPause.innerHTML = "Resume";
  } else {
    state = 1;
    timer = setInterval(() => {
      undraw();
      unDrawNext();
      positionY += 1;
      checkCycle();
    }, 400);
    startPause.innerHTML = "Pause";
  }
});

//Checking Collision with another shape and stopping if true
const freeze = () => {
  if (
    current.some((square) =>
      gridArr[square + positionX + (positionY + 1) * width].classList.contains(
        "taken"
      )
    )
  ) {
    current.forEach((square) =>
      gridArr[square + positionX + positionY * width].classList.add("taken")
    );
    checkScore();
    positionX = Math.floor(Math.random() * 6);
    positionY = 0;
    current = nextShape();
  }
};

//Movements Methods
const moveLeft = () => {
  const atLeftEdge = current.some(
    (square) => (square + positionY * width + positionX) % width === 0
  );
  if (!atLeftEdge) {
    positionX -= 1;
  }
  if (
    current.some((block) =>
      gridArr[block + positionX + (positionY + 1) * width].classList.contains(
        "taken"
      )
    )
  ) {
    positionX += 1;
  }
};
const moveRight = () => {
  const atRightEdge = current.some(
    (square) => (square + positionY * width + positionX) % width === width - 1
  );
  if (!atRightEdge) {
    positionX += 1;
  }
  if (
    current.some((square) =>
      gridArr[square + positionY * width + positionX].classList.contains(
        "taken"
      )
    )
  ) {
    positionX -= 1;
  }
};
const moveDown = () => {
  positionY += 1;
  freeze();
};
const rotateRight = () => {
  let newRotation = getCurrentRotation();
  if (getCurrentRotation() < shapes[getCurrentShape()].length - 1) {
    newRotation = getCurrentRotation() + 1;
  } else {
    newRotation = 0;
  }
  if (canRotate(newRotation)) {
    changeCurrentRotation(newRotation);
    setCurrent();
  }
};
const rotateLeft = () => {
  let newRotation = getCurrentRotation();
  if (getCurrentRotation() > 0) {
    newRotation = newRotation - 1;
  } else {
    newRotation = shapes[getCurrentShape()].length - 1;
  }
  if (canRotate(newRotation)) {
    changeCurrentRotation(newRotation);
    setCurrent();
  }
};


//Checking functions
const canRotate = (newRotation) => {
  let edge = 0;
  if (
    shapes[getCurrentShape()][newRotation].some((square) =>
      gridArr[square + positionX + positionY * width].classList.contains(
        "taken"
      )
    )
  ) {
    return false;
  }
  for (let i = 0; i < shapes[getCurrentShape()][newRotation].length; i++) {
    let block = shapes[getCurrentShape()][newRotation][i];
    if ((block + positionY * width + positionX) % width === width - 1) {
      edge += 1;
    }
    if ((block + positionY * width + positionX) % width === 0) {
      edge += 1;
    }
  }
  if (edge < 2) {
    return true;
  }
  return false;
};

const checkScore = () => {
  //checking every row in the grid
  for (let i = 0; i < 200; i += width) {
    let row = [];
    for (let j = 0; j < 10; j++) {
      row.push(i + j);
    }
    if (row.every((square) => gridArr[square].classList.contains("taken"))) {
      score += 10;
      scoreBoard[0].innerHTML = score;
      row.forEach((square) => {
        gridArr[square].classList.remove("taken");
      });
      let squareRemoved = gridArr.splice(i, width);
      gridArr = squareRemoved.concat(gridArr);
      gridArr.forEach((square) => grid.appendChild(square));
    }
  }
};

const gameOver = () => {
  if (
    current.some((square) =>
      gridArr[square + positionX + positionY * width].classList.contains(
        "taken",
        "top"
      )
    )
  ) {
    scoreBoard[1].innerHTML = score;
    gameOverBoard.classList.add("active");
    state = 0;
    clearInterval(timer);
  }
};

startOver.addEventListener('click', () => {
  startPause.innerHTML = "Start";
  score  = 0;
  location.reload();
})

const checkCycle = () => {
  freeze();
  gameOver();
  drawNext();
  draw();
};
