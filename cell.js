
function cell(i, j, x, y, width, height, isWall) {

    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // f, g, and h values 
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.previous = undefined;
    this.wall = isWall;
    
    this.update = function(g, h, prev){
        this.f = g + h;
        this.g = g;
        this.h = h;
        this.previous = prev;
    }
    this.show = function(color) {
        if (this.wall) {
            fill(0);
            noStroke();
            rect(this.x, this.y, this.width, this.height);
            stroke(0);
            strokeWeight(this.width / 2);
            
        } else if (color) {
            fill(color);
            noStroke();
            rect(this.x, this.y, this.width, this.height);
        }
    }
}
