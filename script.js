let gameActive = false;
let turnCounter = 0;
let playerIsCircle;
let playGrid = [0, 0, 0,    //  0's still ghosts,
                0, 0, 0,    //  1's for player,
                0, 0, 0];   //  2's for bot.

flexboxFillByCells();

function createGame(goesFirst) {
    console.log(goesFirst);
    playerIsCircle = !goesFirst;
    ghostFill();
    gameActive = true;
    hideQuestionBox();
    if (!goesFirst) botMove();
}

function createCell(index) {
    let gameCell = document.createElement("div");
    gameCell.onclick = makeMove;
    gameCell.className = "cell";
    gameCell.id = index + "cell";
    let ghostableDiv = document.createElement("div");
    ghostableDiv.className = "ghost";
    gameCell.appendChild(ghostableDiv);
    return gameCell;
}

function createSvg(isCircle) {
    let thicc = 5; // adjust thickness of circles and x'es
    let size = 60; // size of circle and x container
    const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg1.setAttribute("width", size);
    svg1.setAttribute("height", size);
    if (isCircle) {
        const cir1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        cir1.setAttribute("cx", size/2);
        cir1.setAttribute("cy", size/2);
        cir1.setAttribute("r", size/2);
        cir1.setAttribute("fill", "black");
        svg1.appendChild(cir1);
        const cir2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        cir2.setAttribute("cx", size/2);
        cir2.setAttribute("cy", size/2);
        cir2.setAttribute("r", (size / 2) - thicc);
        cir2.setAttribute("fill", "white");
        svg1.appendChild(cir2);
    } else {
        const dash1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dash1.setAttribute("d", 
        `M${thicc/2} ${thicc/2} L${size - (thicc/2)} ${size - (thicc/2)} 
        M${size - (thicc/2)} ${thicc/2} L${thicc/2} ${size - (thicc/2)}`);
        dash1.setAttribute("stroke", "black");
        dash1.setAttribute("stroke-width", thicc);
        svg1.appendChild(dash1);
    }
    return svg1;
}

function flexboxFillByCells() {
    let flexbox = document.querySelector(".cell-flexbox");
    for (let i = 0; i < 9; i++) {
        let cell = createCell(i);
        let style = "";
        if (i < 3) style = style + "border-top-color: white;\n";
        if (i > 5) style = style + "border-bottom-color: white;\n";
        if (i % 3 == 0) style = style + "border-left-color: white;\n";
        if ((i + 1) % 3 == 0) style = style + "border-right-color: white;\n";
        cell.style = style;
        flexbox.appendChild(cell);
    }
}

function allCells() {
    return document.querySelectorAll(".cell");
}

function clearCells() {
    let cells = allCells();
    cells.forEach(element => element.textContent = "");
}

function assignGhostHover() { // maybe omit??
    let cells = allCells();
    cells.forEach(element => element.className = element.className + " ghost")
}

function ghostFill() {
    let ghostCells = document.querySelectorAll(".ghost");
    console.log(ghostCells);
    for (let i = 0; i < ghostCells.length; i++) {
        const svg = createSvg(playerIsCircle);
        ghostCells[i].textContent = '';
        ghostCells[i].appendChild(svg);
    }
}

function hideQuestionBox() {
    let box1 = document.getElementById("question-box");
    let box2 = document.getElementById("good-luck");
    box1.style = "display: none";
    box2.style = "display: inherit";
}

function makeMove() {
    debugCell(this);
    if (isGhost(this)) {
        console.log("isghost");
        replaceGhost(this);
    }
    else { 
        console.log("ERROR");
        return;
    }
    playGrid[this.id[0]] = 1;
    console.log(winCheck(1));
    turnCounter++;
    if (turnCounter > 8) {
        gameActive = false;
        // Draw
    }
}

function debugCell(cell) {
    console.log(cell.id);
}

function isGhost(cell) {
    return cell.firstElementChild.className == 'ghost';
}

function replaceGhost(cell) {
    cell.firstElementChild.className = "";
}

function winCheck(num) {
    for (let i = 0; i < 9; i = i+3) {   // Horizontal check
        if (playGrid[i] == num &&
            playGrid[i+1] == num &&
            playGrid[i+2] == num) return true;
    }
    for (let i = 0; i < 3; i++) {       // Vertical check
        if (playGrid[i] == num &&
            playGrid[i+3] == num &&
            playGrid[i+6] == num) return true;
    }
    if (playGrid[0] == num &&           // Diagonal down-right check
        playGrid[4] == num &&
        playGrid[8] == num) return true;
    else if (playGrid[2] == num &&      // Diagonal down-left check
        playGrid[4] == num &&
        playGrid[6] == num) return true;
    else return false;
}

// Bot AI ahead

function botMove() {
    if (playerIsCircle && turnCounter == 0) {       // First optimal move if bot goes first
        let corners = [0, 2, 6, 8];
        let cornerPick = Math.floor(Math.random() * 4);
        console.log("corner pick: " + cornerPick);
        console.log("corner: " + corners[cornerPick]);
        playGrid[corners[cornerPick]] = 2;
        appendSvgBot(corners[cornerPick]);
    }
}

function appendSvgBot(cellNumber) {
    let cellID = cellNumber + "cell";
    let cell = document.getElementById(cellID);
    const svg = createSvg(!playerIsCircle);
    cell.textContent = '';
    cell.appendChild(svg);
}
