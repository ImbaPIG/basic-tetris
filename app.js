document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById("grid");
    const miniGrid = document.querySelector("#mini-grid");
    const ScoreDisplay = document.querySelector("#score");
    const StartBtn = document.getElementById("start-button");
    const width = 10;
    let playingfield = [];
    let previewfield = [];
    let timerID;
    let score = 0;
    const colors = ["red", "blue", "orange", "purple", "green"]

    //fills grid and minigrid with divs from array playingfield
    for (let i = 0; i < 200; i++) {
        playingfield.push(document.createElement("div"));
        grid.appendChild(playingfield[i]);
    };
    for (let i = 0; i < 10; i++) {
        playingfield.push(document.createElement("div"));
        playingfield[200 + i].classList.add("taken");
        grid.appendChild(playingfield[200 + i]);
    }
    for (let i = 0; i < 16; i++) {
        previewfield.push(document.createElement("div"));
        miniGrid.appendChild(previewfield[i]);
    }

    //formations of different tetris pieces
    const lTetrisPiece = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetrisPiece = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetrisPiece = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetrisPiece = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetrisPiece = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const theTetrominoes = [lTetrisPiece, zTetrisPiece, tTetrisPiece, oTetrisPiece, iTetrisPiece]
    let randomizer = Math.floor(Math.random() * theTetrominoes.length);
    console.log(randomizer);
    let current = theTetrominoes[randomizer][0];
    let currentPosition = 4;
    let currentRotation = 0;

    //draws Tetris blocks
    function draw() {
        current.forEach(index => {
            playingfield[currentPosition + index].classList.add("tetrisPiece");
            playingfield[currentPosition + index].style.backgroundColor = colors[randomizer];
        });
    }

    function undraw() {
        current.forEach(index => {
            playingfield[currentPosition + index].classList.remove("tetrisPiece");
            playingfield[currentPosition + index].style.backgroundColor = "";
        });
    }
    draw();
    //Function that moves down the tetrisPieces every n ms


    function control(event) {
        //matches input of arrow keys to moving tetris pieces
        switch (event.keyCode) {
            case 37: moveLeft();
                break;
            case 38: rotate();
                break;
            case 39: moveRight();
                break;
            case 40: moveDown();
                break;
        }
        if (event.keyCode === 37) moveLeft();
    }
    function moveDown() {
        //moves every tetris piece a row down
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }
    document.addEventListener("keyup", control);

    function freeze() {
        //checks if game is lot / stops bottom tetris pieces moving
        if (current.some(index => playingfield[currentPosition + index + width].classList.contains("taken"))) {
            current.forEach(index => playingfield[currentPosition + index].classList.add("taken"));
            randomizer = nextRandomizer
            nextRandomizer = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[randomizer][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore()
            gameOver()
        }
    }
    function moveLeft() {
        //moves tetris piece left
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => playingfield[currentPosition + index].classList.contains("taken"))) {
            currentPosition += 1
        }
        draw();
        displayShape()
    }

    function moveRight() {
        //moves tetris piece right
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1
        if (current.some(index => playingfield[currentPosition + index].classList.contains("taken"))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotate() {
        //rotates tetris piece by 90 degrees
        undraw();
        currentRotation++
        currentRotation %= 4;
        current = theTetrominoes[randomizer][currentRotation];
        draw();
    }
    const displayWidth = 4;
    const displayIndex = 0;
    let nextRandomizer = 0;
    const upNextTetrisPieces = {
        0: [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        1: [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        2: [1, displayWidth, displayWidth + 1, displayWidth + 2],
        3: [0, 1, displayWidth, displayWidth + 1],
        4: [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    }


    function displayShape() {
        //shows next tetris piece coming up
        previewfield.forEach(piece => {
            piece.classList.remove("tetrisPiece");
            piece.style.backgroundColor = "";
        })
        upNextTetrisPieces[nextRandomizer].forEach(index => {
            previewfield[displayIndex + index].classList.add("tetrisPiece")
            previewfield[displayIndex + index].style.backgroundColor = colors[nextRandomizer];
        })
    }

    StartBtn.addEventListener("click", () => {
        //eventlistener for start button
        if (timerID) {
            clearInterval(timerID);
            timerID = null;
        } else {
            draw();
            timerID = setInterval(moveDown, 1000);
            displayShape();
        }
    })

    function addScore() {
        //adds score if one row is full of tetris pieces
        for (let i = 0; i <= 190; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
            if (row.every(index => playingfield[index].classList.contains("taken"))) {
                score += 10
                ScoreDisplay.innerHTML = score
                row.forEach(index => {
                    playingfield[index].classList.remove("taken")
                    playingfield[index].classList.remove("tetrisPiece")
                    playingfield[index].style.backgroundColor = "";
                    console.log(index)
                })
                const fieldsRemoved = playingfield.splice(i, width)
                playingfield = fieldsRemoved.concat(playingfield)
                playingfield.forEach(cell => grid.appendChild(cell))


            }


        }
    }
    function gameOver() {
        //stops timer, ends game
        if (current.some(index => playingfield[currentPosition + index].classList.contains("taken"))) {
            ScoreDisplay.innerHTML = " end"
            clearInterval(timerID)
        }
    }
}) 