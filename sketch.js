
var cols = 25;
var rows = 25;
var wallFreq = 0.3;
var maze;
var mapGraphic = null;
var uiElements = [];
var paused = true;
var flip = false;
var smallG = false;
var pathfinder;
var status = "";
var stepsAllowed = 0;
var runPauseButton = new Button("run", 430, 20, 50, 30, runpause);
var path;


function setup() {
    if (getURL().toLowerCase().indexOf("fullscreen") === -1) {
        createCanvas(600, 600);
    } else {
        var sz = min(windowWidth, windowHeight);
        createCanvas(sz, sz);
    }
    
    initialiseSearchExample(cols, rows);

    uiElements.push(runPauseButton);
    uiElements.push(new Button("step", 430, 70, 50, 30, step));
    uiElements.push(new Button("restart", 430, 120, 50, 30, restart));
    uiElements.push(new Button("reverse", 430, 200, 50, 30, backward));
    uiElements.push(new Button("g value", 430, 250, 50, 30, tiebreaker));

}

function initialiseSearchExample(rows, cols) {
    maze = new maze(cols, rows, 10, 10, 410, 410, wallFreq);
    start = maze.grid[floor(random(cols))][floor(random(rows))];
    do{
        end = maze.grid[floor(random(cols))][floor(random(rows))];    
    }while (start == end);
    
    start.wall = false;
    end.wall = false;

    pathfinder = new aStar(maze, start, end, smallG);
}

function searchStep() {
    if (!paused || stepsAllowed > 0) {
        var result = pathfinder.step();
        stepsAllowed--;

        switch (result) {
            case 0:
                status = "Searching...";
                break;
            case 1:
                status = "Path found.";
                pauseUnpause(true);
                break;
            case -1:
                status = "No path.";
                pauseUnpause(true);
                break;
        }
    }
}



function draw() {
    searchStep();

    background(255);
    doGUI();
    text("Status - " + status, 10, 450);
    text("Expanded cell count:" + pathfinder.closedSet.length, 10, 470);
    text(smallG ? "small-g" : "large-g", 490, 270);
    text(flip ? "backward" : "forward", 490, 220);

    drawMap();
    pathfinder.end.show(color(255, 0, 0));

    for (var i = 0; i < pathfinder.closedSet.length; i++) {
        pathfinder.closedSet[i].show(color(255, 0, 0, 50));
    }

    var infoNode = null;

    for (i = 0; i < pathfinder.openSet.length; i++) {
        var node = pathfinder.openSet[i];
        node.show(color(0, 255, 0, 50));
        if (mouseX > node.x && mouseX < node.x + node.width &&
            mouseY > node.y && mouseY < node.y + node.height) {
            infoNode = node;
        }
    }

    fill(0);
    if (infoNode != null) {
        text("f = " + infoNode.f, 430, 330);
        text("g = " + infoNode.g, 430, 350);
        text("h = " + infoNode.h, 430, 370);
    }

    path = calcPath(pathfinder.lastCheckedNode);
    drawPath(path);
}



function drawMap() {
    if (mapGraphic == null) {
        for (var i = 0; i < maze.cols; i++) {
            for (var j = 0; j < maze.rows; j++) {
                if (maze.grid[i][j].wall) {
                    maze.grid[i][j].show(color(255));
                }
            }
        }
        mapGraphic = get(maze.x, maze.y, maze.w, maze.h);
    }
    image(mapGraphic, maze.x, maze.y);
}

function calcPath(endNode) {
    path = [];
    var temp = endNode;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }
    return path;
}

function clearPath(path){
    noFill();
    stroke(0, 0, 0);
    strokeWeight(maze.w / maze.cols / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].x + path[i].width / 2, path[i].y + path[i].height / 2);
    }
    endShape();
}
function drawPath(path) {
    noFill();
    stroke(153, 0, 153);
    strokeWeight(maze.w / maze.cols / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].x + path[i].width / 2, path[i].y + path[i].height / 2);
    }
    endShape();
}


function Button(label, x, y, w, h, callback) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.callback = callback;

    this.show = function() {
        stroke(0);
        strokeWeight(1);
        noFill();
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        noStroke();
        text(this.label, this.x + 5, this.y+15 , this.w, this.h);
    }

    this.mouseClick = function(x, y) {
        if (this.callback != null &&
            x > this.x && x <= this.x + this.w &&
            y > this.y && y <= this.y + this.h) {
            this.callback(this);
        }
    }
}

function step(button) {
    pauseUnpause(true);
    stepsAllowed = 1;
}

function pauseUnpause(pause) {
    paused = pause;
    runPauseButton.label = paused ? "run" : "pause";
}

function runpause(button) {
    pauseUnpause(!paused);
}

function restart(button) {
    clearPath(path);
    pathfinder.reset();
    maze.clearMaze();
    pauseUnpause(true);
}

function backward(button) {
    restart();
    flip = !flip;
    if(flip){
        pathfinder = new aStar(maze, end, start, smallG);
    } else {
        pathfinder = new aStar(maze, start, end, smallG);
    }

    pauseUnpause(true);
}

function tiebreaker(button){
    restart();
    smallG = !smallG;
    if(smallG){
        pathfinder = new aStar(maze, start, end, smallG);
    } else {
        pathfinder = new aStar(maze, start, end, smallG);
    }
    pauseUnpause(true);
}


function mouseClicked() {
    for (var i = 0; i < uiElements.length; i++) {
        uiElements[i].mouseClick(mouseX, mouseY);
    }

}

function doGUI() {
    for (var i = 0; i < uiElements.length; i++) {
        uiElements[i].show();
    }
}

