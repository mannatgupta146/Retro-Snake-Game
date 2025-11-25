const board = document.querySelector('.board')
const blockWidth = 40
const blockHeight = 40

const cols = Math.floor(board.clientWidth / blockWidth)
const rows = Math.floor(board.clientHeight / blockHeight)

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

let direction = ''

for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
        const block = document.createElement('div')
        block.classList.add('block')
        board.appendChild(block)
        blocks[`${row}, ${col}`] = block
    }
}

// let c1 = Math.floor(Math.random()*256)
// let c2 = Math.floor(Math.random()*256)
// let c3 = Math.floor(Math.random()*256)

// document.documentElement.style.setProperty('--bg-fill-color', `rgb(${c1}, ${c2}, ${c3})`)

function render(){
    snake.forEach(segment => {
        blocks[`${segment.x}, ${segment.y}`].classList.add('fill')
    })
}