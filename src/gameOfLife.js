const Status = {
    ALIVE: 0,
    DEAD: 1
}

class Cell {
    constructor(width, height, x, y) {
        this.status = Status.DEAD;
        this.xLocation = x;
        this.yLocation = y;
        this.aliveNextCycle = false;
        this.deadNextCycle = false;
        this.element = document.createElement("td");
        this.element.style.width = width.toString() + "px";
        this.element.style.height = height.toString() + "px";
        this.element.addEventListener("mouseover", (e) => {
            if ((e.buttons == 1 || e.buttons == 3) && e.shiftKey && this.status === Status.ALIVE) {
                this.setStatus(Status.DEAD);
            } 
            
            if ((e.buttons == 1 || e.buttons == 3) && !e.shiftKey && this.status === Status.DEAD) {
                this.setStatus(Status.ALIVE);
            }
        });
        this.element.addEventListener("mousedown", (e) => {
            if(this.getStatus() === Status.DEAD) {
                this.setStatus(Status.ALIVE);
            } else {
                this.setStatus(Status.DEAD);
            }
        });
    }

    getElement() {
        return this.element;
    }

    getStatus() {
        return this.status;
    }

    updateStatus(){
        if(this.isAliveNextCycle()){
            this.setStatus(Status.ALIVE);
            this.makeAliveNextCycle(false);
        }
        else if(this.isDeadNextCycle()){
            this.setStatus(Status.DEAD);
            this.makeDeadNextCycle(false);
        }
    }

    setStatus(status) {
        if(status === Status.ALIVE) {
            this.element.style.backgroundColor = "black";
        } else {
            this.element.style.backgroundColor = "white";
        }

        this.status = status;
    }

    isAliveNextCycle(){
        return this.aliveNextCycle;
    }

    isDeadNextCycle(){
        return this.deadNextCycle;
    }

    makeAliveNextCycle(aliveNextCycle){
        this.aliveNextCycle = aliveNextCycle;
    }

    makeDeadNextCycle(deadNextCycle){
        this.deadNextCycle = deadNextCycle;
    }

    getXLocation() {
    	return this.xLocation;
    }
    
    getYLocation() {
    	return this.yLocation;
    }
}


let height = 50;
let width = 50;

const board = document.getElementById("board");
const cells = new Array(height);


for (let i = 0; i < height; i++) {
    cells[i] = new Array(width);
    const newRow = document.createElement("tr");
    for (let j = 0; j < width; j++) {
        cells[i][j] = new Cell(10, 10,i,j);
        newRow.appendChild(cells[i][j].getElement());
    }
    board.appendChild(newRow);
}

let halt = true;

function start() {
    halt = false;
}

function stop() {
    halt = true;
}

const startBtn = document.getElementById("start_btn");
startBtn.addEventListener("click", () => {
    start();
});
const stopBtn = document.getElementById("stop_btn");
stopBtn.addEventListener("click", () => {
    stop();
});

const statusIndicator = document.getElementById("status_indicator");
const green = "#77DD77";
const red = "#FF6961";

let intervalID = window.setInterval(() => {
    if (!halt) {
        if(statusIndicator.style.backgroundColor !== green) {
            statusIndicator.style.backgroundColor = green;
        }
        checkRules()
    } else {
        if(statusIndicator.style.backgroundColor !== red) {
            statusIndicator.style.backgroundColor = red;
        }
    }
}, 100);

function checkRules() {
    // Could probably keep a running list of locations that even qualify for being checked :)

    for(let i = 0; i< cells.length; i++){
        for(let j = 0; j < cells[i].length; j++){
            checkRulesAtLocation(i, j);
        }
    }

    // Not sure that I need to do this loop twice tbh

    for(let i = 0; i< cells.length; i++){
        for(let j = 0; j < cells[i].length; j++){
            cells[i][j].updateStatus();
        }
    }
}

function checkRulesAtLocation(x,y) {
    let aliveNeighbors = 0;
    for(let i = y-1; i <= y + 1; i++){
        if(i >= 0 && i < cells[x].length){
            if(x-1 >= 0){
                if(cells[x-1][i].getStatus() == Status.ALIVE){
                    aliveNeighbors++;
                }
            }
            if(i != y){
                if(cells[x][i].getStatus() == Status.ALIVE){
                    aliveNeighbors++;
                }
            }
            if(x+1 < cells.length){
                if(cells[x+1][i].getStatus() == Status.ALIVE){
                    aliveNeighbors++;
                }
            }
        }
    }

    if((aliveNeighbors == 2 || aliveNeighbors == 3) && cells[x][y].getStatus() == Status.ALIVE){
        cells[x][y].makeAliveNextCycle(true);
    }
    else if((aliveNeighbors < 2 || aliveNeighbors > 3) && cells[x][y].getStatus() == Status.ALIVE){
        cells[x][y].makeDeadNextCycle(true);
    }
    if(aliveNeighbors == 3 && cells[x][y].getStatus() == Status.DEAD){
        cells[x][y].makeAliveNextCycle(true);
    }
}

// for (let i = 0; i < height; i++) {
//     let cellrow = document.createElement("tr");
//     for (let j = 0; j < width; j++) {
//         let column = document.createElement("td");
//         column.onclick = () => {
//             column.style.background = column.style.background === "black" ? "white" : "black";
//         }
//         row.appendChild(column);
//     }    
//     board.appendChild(row);
// }

/* TODO 
    - Make a little more modular
    - be able to save and name patterns as cookies :)
        - Also load
    - Make more efficient, specifically see first comment in checkRules Function
        - Not all cells need to be checked we just need to keep track of the ones that will need to be checked
        
*/
