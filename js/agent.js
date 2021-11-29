class Agent extends Entity{
    #score;
    #fitness;

    // #network;
    #gravity;

    #width;
    #height;

    #position;
    #velocity;
    #acceleration;

    constructor(x, y, height, width, parent1Network, parent2Network, firstPoint, secondPoint) {
        super(x, y, height, width);

        this.#gravity = 0.9;

        // this.#position = new Position(x, y);
        this.#velocity = new Velocity(0, 0);
        this.#acceleration = new Acceleration(0, 0);

        // properties of Agent
        this.#score = 0;
        this.#fitness = 0;

        // create the neural network
        if(parent1Network && parent2Network && firstPoint && secondPoint){
            this.network = parent1Network.copy(parent2Network, firstPoint, secondPoint);

        }else{
            this.network = new NeuralNetwork(4, 20, 2);
        }
    }

    get score(){
        return this.#score;
    }

    get fitness(){
        return this.#fitness;
    }

    set fitness(fitness){
        this.#fitness = fitness;
    }

    jumpTo(x, y){
        this.#velocity.y = 0;
        this.updatePosition(x, y);
    }


    dispose(){
        this.network.dispose();
    }

    mutate(rate) {
        this.network.mutate(rate);
    }

    move(bars, maxHeight, maxWidth) {
        let closestBar = null;
        let closestD = Infinity;

        for (let i = 0; i < bars.length; i++) {
            let d = bars[i].x + bars[i].width - this.x;
            if (d < closestD && d > 0) {
                closestBar = bars[i];
                closestD = d;
            }
        }


        let posBar = 0
        let heiBar = 0

        if (closestBar){
            if(closestBar.x <= maxWidth){
                posBar = closestBar.x;
                heiBar = closestBar.y;
            }
        }

        if(Math.abs(this.y - (maxHeight - this.height)) === 0){
            let inputs = [];
            inputs[0] = this.#velocity.x/10;
            inputs[1] = this.#velocity.y/10;
            let ydiff=heiBar-this.y;
            let xdiff=posBar-this.x;
            inputs[2] = xdiff / maxWidth;
            inputs[3] = ydiff / maxHeight;

            //inputs[4] = posBar / maxWidth;
            //inputs[5] = heiBar / maxHeight;

            let output = this.network.predict(inputs);

            this.#acceleration.x = output[0];
            this.#acceleration.y = output[1];
        }
        else{
            this.#acceleration.x = 0;
            this.#acceleration.y = 0;
        }

    }
    
    update(){
        this.#score++;
        this.#velocity.y = this.#velocity.y + this.#gravity - this.#acceleration.y;
        this.#velocity.x += this.#acceleration.x;
        this.updatePosition(this.x + this.#velocity.x, this.y + this.#velocity.y);
    }
}