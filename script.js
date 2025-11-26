const board = document.querySelector('.board')
const blockWidth = 40
const blockHeight = 40

const cols = Math.floor(board.clientWidth / blockWidth)
const rows = Math.floor(board.clientHeight / blockHeight)

let intervalId = null

const blocks = []
const snake = [
    {
        x: 1, y: 3
    }, 

    {
        x: 1, y: 4
    }, 

    {
        x: 1, y: 5
    }
]

let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)}

let direction = 'right'

for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
        const block = document.createElement('div')
        block.classList.add('block')
        board.appendChild(block)
        blocks[`${row}, ${col}`] = block
    }
}

// initial colors
document.documentElement.style.setProperty('--bg-food-color', `red`)

function render(){

    let head = null

    blocks[`${food.x}, ${food.y}`].classList.add('food')

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

    if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
        alert('Game Over')
        clearInterval(intervalId)
        return
    }

    // remove old snake fill
    snake.forEach(segment => {
        blocks[`${segment.x}, ${segment.y}`].classList.remove('fill')
    })

    // eat food
    if(head.x === food.x && head.y === food.y){

        blocks[`${food.x}, ${food.y}`].classList.remove('food')
        food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)}
        blocks[`${food.x}, ${food.y}`].classList.add('food')

        // generate new random colors
        let f1 = Math.floor(Math.random()*256)
        let f2 = Math.floor(Math.random()*256)
        let f3 = Math.floor(Math.random()*256)

        document.documentElement.style.setProperty('--bg-food-color', `rgb(${f1}, ${f2}, ${f3})`)

        snake.unshift(head)   // grow
    }
    else{
        snake.unshift(head)
        snake.pop()
    }

    // add new snake
    snake.forEach(segment => {
        blocks[`${segment.x}, ${segment.y}`].classList.add('fill')
    })
}

intervalId = setInterval(() =>{
    render()
}, 300)

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
