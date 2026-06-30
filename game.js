const bird = document.getElementById("bird");
const game = document.getElementById("game");
const scoreValue = document.getElementById("scoreValue");
const startModal = document.getElementById("startModal");
const gameOverModal = document.getElementById("gameOverModal");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const finalScore = document.getElementById("finalScore");

const pipeImgSrc = "./assets/pipe.png";
let pipeDistanceFromLeft = 300;
let tallHeight = true;
let isGameOver = false;
let isGameStarted = false;

let birdTop = 200;
let gravity = 2;
let birdRect;
let score = 0;

let renderPipesInterval;
let birdMoveInterval;

// Event to make bird jump -
window.addEventListener("keydown", (e) => {
    if(isGameStarted){
        const key = e.key;
        if(key === " " || key === "w" || key === "ArrowUp"){
            birdTop -= 50;
        }
    }
}); 

function startGame(){
    renderPipes();
    isGameStarted = true;
    bird.src = "./assets/mainbird.gif";

    // Logic to move bird -
    birdMoveInterval = setInterval(() => {
        birdRect = bird.getBoundingClientRect();
        const gameHeight = game.clientHeight;
    
        if(birdRect.bottom >= gameHeight || birdRect.top <= -30){
            gameOver();
        }

        birdTop += gravity;
        bird.style.top = `${birdTop}px`;
        // console.log(birdRect.bottom);
    }, 20);

    renderPipesInterval = setInterval(() => {
        renderPipes();
    }, 2000);
}

startBtn.addEventListener("click", () => {
    startModal.classList.add("hidden");
    startGame();
});

restartBtn.addEventListener("click", () => {
    gameOverModal.classList.add("hidden");
    const pipes = document.querySelectorAll(".pipes");
    pipes.forEach(pipe => {
        pipe.remove();
    });
    isGameOver = false;
    pipeDistanceFromLeft = 300
    tallHeight = true;
    birdTop = 200
    score = 0;
    scoreValue.textContent = 0;
    startGame();
});

// Rendering Pipes - 
function renderPipes(){
    const pipe1 = document.createElement("img");
    const pipe2 = document.createElement("img");
    pipe1.src = pipeImgSrc;
    pipe2.src = pipeImgSrc;

    pipe1.classList.add("pipes");
    pipe2.classList.add("pipes");
    pipe1.style.left = `${pipeDistanceFromLeft}px`;
    pipe2.style.left = `${pipeDistanceFromLeft}px`;
    pipe1.style.top = "-55px";
    pipe2.style.bottom = "-35px";
    
    pipe1.style.transform = `rotate(180deg)`;

    if(tallHeight){
        pipe1.style.height = "450px";
        pipe2.style.height = "250px";
        tallHeight = false;
    } else {
        pipe1.style.height = "400px";
        pipe2.style.height = "350px";
        tallHeight = true;
    }

    let pipeLeft = game.clientWidth - 50;
    pipe1.style.left = `${pipeLeft}px` 
    pipe2.style.left = `${pipeLeft}px` 
    
    game.append(pipe1, pipe2);
    pipeDistanceFromLeft += 550;
    
    let movePipe = setInterval(() => {
        if(isGameOver){
            clearInterval(movePipe);
        }

        if(pipeLeft <= -250){
            clearInterval(movePipe);
            pipe1.remove();
            pipe2.remove();
            score += 10;
            scoreValue.textContent = score;
        }

        pipeLeft -= 2;
        pipe1.style.left = `${pipeLeft}px`;
        pipe2.style.left = `${pipeLeft}px`; 

        const pipeTopRect = pipe1.getBoundingClientRect(); 
        const pipeBottomRect = pipe2.getBoundingClientRect(); 

        const birdBox = getBirdHitbox();
        const pipe1Rect = pipe1.getBoundingClientRect();
        const pipe2Rect = pipe2.getBoundingClientRect();
        // console.log("Pipe", pipe2Rect.top);

        if (isColliding(birdBox, pipe1Rect) || isColliding(birdBox, pipe2Rect)) {
            gameOver();
        }

    }, 10);
}

function isColliding(birdRect, pipeRect) { // Collison check krne ki jagah, we are checking that pipe and birds are seperate or not,
    return !(
        birdRect.right < pipeRect.left || 
        birdRect.left > pipeRect.right ||   
        birdRect.bottom < pipeRect.top ||
        birdRect.top > pipeRect.bottom   
    );
}

function gameOver(){
    gameOverModal.classList.remove("hidden");
    finalScore.textContent = score;
    isGameOver = true;
    bird.src = "./assets/birdPng.png";
    clearInterval(birdMoveInterval);
    clearInterval(renderPipesInterval);
    console.log("game over");
}

function getBirdHitbox() {
    const rect = bird.getBoundingClientRect();
    
    const insetLeft = 100;
    const insetRight = 30;
    const insetTop = -35;
    const insetBottom = 35;

    return {
        left: rect.left + insetLeft,
        right: rect.right - insetRight,
        top: rect.top - insetTop,
        bottom: rect.bottom - insetBottom,
    }; // kyuki bird gif ki ass pass extra padding h inset se we can handle collision better
}