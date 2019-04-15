function maze(cols, rows, x, y, w, h, wallFreq) {
    this.grid = [];
    
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.cols = cols;
    this.rows = rows;
    var cell_width = w / cols;
    var cell_height = h / rows;

    for (var i = 0; i < cols; i++) {
        this.grid[i] = [];
        for (var j = 0; j < rows; j++) {
            var isWall = random(1.0) < wallFreq;
            this.grid[i][j] = new cell(i, j, x + i * cell_width, y + j * cell_height, cell_width, cell_height, isWall);
        }
    }
    
    this.clearMaze = function(){
        for (i = 0; i < cols; i++) {
            for (j = 0; j < rows; j++) {
                this.grid[i][j].previous = undefined;
            }
        }
    }
}
