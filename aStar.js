
function aStar(map, start, end, tiebreaker){
    this.map = map;
    this.lastCheckedNode = start;
    this.openSet = [];
    this.openSet.push(start);
    this.closedSet = [];
    this.start = start;
    this.end = end;
    this.smallG = tiebreaker;

    this.heuristic = function(a, b) {
        return abs(a.i - b.i) + abs(a.j - b.j);
    };

    this.remove = function(arr, elt) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == elt) {
                arr.splice(i, 1);
            }
        }
    };
    this.flipTiebreaker = function(){
        smallG = !smallG;
    };
    this.reset = function(){
        this.openSet = [];
        this.openSet.push(start);
        this.closedSet = [];
        this.lastCheckedNode = start;
        
    };
    this.step = function() {
        if (this.openSet.length > 0) {
            var winner = 0;
            for (var i = 1; i < this.openSet.length; i++) {
                if (this.openSet[i].f < this.openSet[winner].f) {
                    winner = i;
                }
                if (this.openSet[i].f == this.openSet[winner].f) {
                    if (this.openSet[i].g >= this.openSet[winner].g) {
                        if(!smallG){ 
                            winner = i;
                        }
                    }
                }
            }
            var current = this.openSet[winner];
            this.lastCheckedNode = current;
            if (current === this.end) {
                //goal reached
                return 1;
            }
            this.remove(this.openSet, current);
            this.closedSet.push(current);
    
            var neighbor1 = current;
            var neighbor2 = current;
            for(i=-1; i<2; i+=2){
                var tempi = current.i+i;
                var tempj = current.j+i;
                if(tempi >= 0 && tempi < map.grid.length){
                    neighbor1 = map.grid[tempi][current.j];
                    this.checkNeighbor(neighbor1, current);
                }
                if(tempj >= 0 && tempj < map.grid[0].length){
                    neighbor2 = map.grid[current.i][tempj];
                    this.checkNeighbor(neighbor2, current);
                }
            }
            return 0;
        } else {
            //no path
            return -1;
        }
    };
    this.checkNeighbor = function(neighbor, current){
        if(!neighbor.wall){
            if (!this.closedSet.includes(neighbor)) {
                if (!this.openSet.includes(neighbor)) {
                    neighbor.update((current.g + 1), this.heuristic(neighbor, end), current);
                    this.openSet.push(neighbor);
                } else if((current.g + 1)< neighbor.g){
                    neighbor.update((current.g + 1), this.heuristic(neighbor, end), current);
                }
            }
        }           
    }
}
