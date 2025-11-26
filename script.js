const board = document.querySelector('.board')

const startButton = document.querySelector('.start-btn')
const restartButton = document.querySelector('.restart-btn')

const modal = document.querySelector('.modal')
const startGameModal = document.querySelector('.start-game')
const gameOverModal = document.querySelector('.game-over')

const highScoreElement = document.querySelector('#high-score')
const scoreElement = document.querySelector('#score')
const timeElement = document.querySelector('#time')

const blockWidth = 45
const blockHeight = 45

// load high score from local storage
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0
highScoreElement.innerText = highScore

let score = 0
let time = '00:00'

const cols = Math.floor(board.clientWidth / blockWidth)
const rows = Math.floor(board.clientHeight / blockHeight)

let intervalId = null
let timeIntervalId = null

const blocks = []

// starting snake positions
let snake = [
    {x: 2, y: 5}, 
    {x: 2, y: 4}, 
    {x: 2, y: 3}
]

// generate first food
let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)}

// starting direction
let direction = 'right'

// create board blocks
for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
        const block = document.createElement('div')
        block.classList.add('block')
        board.appendChild(block)
        blocks[`${row}, ${col}`] = block
    }
}

// set initial food color
document.documentElement.style.setProperty('--bg-food-color', `red`)

function render(){

    let head = null

    // show the food
    blocks[`${food.x}, ${food.y}`].classList.add('food')

    // move snake head according to direction
    if(direction === 'left'){
        head = {x: snake[0].x, y: snake[0].y - 1}
    }

    else if(direction === 'right'){
        head = {x: snake[0].x, y: snake[0].y + 1}
    }
    
    else if(direction === 'down'){
        head = {x: snake[0].x + 1, y: snake[0].y}
    }

    else if(direction === 'up'){
        head = {x: snake[0].x - 1, y: snake[0].y}
    }

    // check if snake hits the wall
    if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){

        // stop game and timer
        clearInterval(intervalId)
        clearInterval(timeIntervalId)

        // show game over modal
        modal.style.display = 'flex'
        startGameModal.style.display = 'none'
        gameOverModal.style.display = 'flex'

        return
    }

    // remove old snake blocks from screen
    snake.forEach(segment => {
        blocks[`${segment.x}, ${segment.y}`].classList.remove('fill')
    })

    // check if snake eats food
    if(head.x === food.x && head.y === food.y){

        // remove old food
        blocks[`${food.x}, ${food.y}`].classList.remove('food')

        // make new food
        food = {
            x: Math.floor(Math.random()*rows),
            y: Math.floor(Math.random()*cols)
        }
        blocks[`${food.x}, ${food.y}`].classList.add('food')

        // random new food color
        let f1 = Math.floor(Math.random()*256)
        let f2 = Math.floor(Math.random()*256)
        let f3 = Math.floor(Math.random()*256)

        document.documentElement.style.setProperty('--bg-food-color', `rgb(${f1}, ${f2}, ${f3})`)

        // increase snake size
        snake.unshift(head)

        // increase score
        score += 10
        scoreElement.innerText = score

        // update high score if needed
        if(score > highScore){
            highScore = score
            localStorage.setItem('highScore', highScore.toString())
            highScoreElement.innerText = highScore
        }
    }

    else{
        // move snake normally
        snake.unshift(head)
        snake.pop()
    }

    // show new snake position
    snake.forEach(segment => {
        blocks[`${segment.x}, ${segment.y}`].classList.add('fill')
    })
}

startButton.addEventListener('click', ()=>{
    modal.style.display = 'none'

    // start game loop
    intervalId = setInterval(()=>{
        render()
    },300)

    // start timer loop
    timeIntervalId = setInterval(()=>{
        let [mins, secs] = time.split(':').map(Number)

        if(secs === 59){
            mins += 1
            secs = 0
        }
        else{
            secs += 1
        }

        time = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`
        timeElement.innerText = time
    },1000)
})

restartButton.addEventListener('click', ()=>{
    restartGame()
})

function restartGame() {

    // stop old game loop
    clearInterval(intervalId)
    clearInterval(timeIntervalId)

    // remove old food block
    if (blocks[`${food.x}, ${food.y}`]) {
        blocks[`${food.x}, ${food.y}`].classList.remove('food')
    }

    // set initial food color
    document.documentElement.style.setProperty('--bg-food-color', `red`)

    // remove old snake from screen
    snake.forEach(segment => {
        if (blocks[`${segment.x}, ${segment.y}`]) {
            blocks[`${segment.x}, ${segment.y}`].classList.remove('fill')
        }
    })

    // reset score
    score = 0
    scoreElement.innerText = score
   
    // reset time
    time = '00:00'
    timeElement.innerText = time

    highScoreElement.innerText = highScore

    modal.style.display = 'none'

    // reset snake to starting position
    snake = [
        { x: 2, y: 5 },
        { x: 2, y: 4 },
        { x: 2, y: 3 }
    ]

    // reset direction
    direction = 'right'

    // generate new food
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    }

    // draw snake and new food on screen
    snake.forEach(segment => {
        blocks[`${segment.x}, ${segment.y}`].classList.add('fill')
    })
    blocks[`${food.x}, ${food.y}`].classList.add('food')

    // start snake movement again
    intervalId = setInterval(() => {
        render()
    }, 300)

    // start timer again
    timeIntervalId = setInterval(()=>{
        let [mins, secs] = time.split(':').map(Number)

        if(secs === 59){
            mins += 1
            secs = 0
        }
        else{
            secs += 1
        }

        time = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`
        timeElement.innerText = time
    },1000)
}

addEventListener('keydown', (event) =>{
    if(event.key === 'ArrowUp'){
        direction = 'up'
    }
    else if(event.key === 'ArrowDown'){
        direction = 'down'
    }
    else if(event.key === 'ArrowLeft'){
        direction = 'left'
    }
    else if(event.key === 'ArrowRight'){
        direction = 'right'
    }
})
