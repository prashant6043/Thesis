class Entity{
    #position;
    #width;
    #height;

    constructor(x, y, height, width) {
        this.#position = new Position(x, y);
        this.#height = height;
        this.#width = width;
    }

    get x(){
        return this.#position.x;
    }

    get y(){
        return this.#position.y;
    }

    get width(){
        return this.#width;
    }

    get height(){
        return this.#height;
    }

    updatePosition(x, y){
        this.#position.x = x;
        this.#position.y = y;
    }
}