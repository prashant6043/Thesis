// the vector class to track vector components
class Vector{
    #x;
    #y;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    get x(){
        return this.#x;
    }

    get y(){
        return this.#y;
    }

    set x(x){
        this.#x = x;
    }

    set y(y){
        this.#y = y;
    }
}

// the position vector
class Position extends Vector{}

// the velocity vector
class Velocity extends Vector{}

// the acceleration vector
class Acceleration extends Vector{}
