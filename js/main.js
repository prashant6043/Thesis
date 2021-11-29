const AGENT_WIDTH = 68
const AGENT_HEIGHT = 68
const BAR_WIDTH = 30

let agentImg;
let slider;

let bars = [];
let agents = [];
let savedAgents = [];

let speed = 5;
let maxScore = 0;
let currentGeneration = 0;
let bestScore=0;
let bestGeneration=0;

// world state
let active = false;
let population, crossOverMethod, selectionMethod, mutationRate;

// the configuration values
let populationInput = document.getElementById("population");
let crossOverMethodSelect = document.getElementById("crossOverMethod");
let selectionMethodSelect = document.getElementById("selectionMethod");
let mutationRateInput = document.getElementById("mutationRate");
let modal = document.getElementById("modal");

function setup() {
    // create the interface
    createCanvas(windowWidth, windowHeight-5);

    // the agent Image
    agentImg = loadImage('img/robot.run.gif');

    // set up tensorflow processor
    tf.setBackend('cpu');

    // the slider
    // slider = createSlider(1, 10, 5);
    // slider.position(windowWidth / 2 - 150, windowHeight - 30);
    // slider.addClass("slider");
}

function draw(){
    if(!active) return

    // set speed value
    // speed = slider.value();

    let newBar = createNewBar(bars, BAR_WIDTH, height, width);
    if(!barOverlap(bars, newBar, BAR_WIDTH)){
        updateBars(bars, newBar)
    }


    for (let i = bars.length - 1; i >= 0; i--){
        let bar = bars[i];

        // move the bar
        moveBar(bar, speed);

        for (let j = agents.length - 1; j >= 0; j--){
            let agent = agents[j];

            // check if there is a collision
            if (barAgentCollided(bar, agent)) {

                // remove and save
                removeAndSaveAgent(agents, j, savedAgents)

                // alert("collision!")
            }
        }

        // if bar is off the screen
        if(barOffScreen(bar, -width)){
            removeBar(bars, i);
        }
    }

    maxScore = 0;
    agents.map(
        (agent, index) => {

            agent.move(bars, height, width);
            agent.update();

            if (agentHitGround(agent, height)) {
                agent.jumpTo(agent.x, height - AGENT_HEIGHT);
            }

            if (agentOffScreen(agent, width)) {
                // remove and save
                removeAndSaveAgent(agents, index, savedAgents)
            }


            maxScore = max(maxScore, agent.score);
            if (maxScore>bestScore){
                bestScore=maxScore;
                bestGeneration=currentGeneration;
            }
        }
    )

    // the information board
    displayInfo(currentGeneration, maxScore, agents, bestScore, bestGeneration, population,selectionMethod,crossOverMethod,mutationRate)

    // show all bars
    showBars(bars);

    // show all agents
    showAgents(agents, agentImg)


    // go to next gen
    if (agents.length === 0) {
        currentGeneration++
        nextGeneration(
            height,
            AGENT_HEIGHT,
            AGENT_WIDTH,
            maxScore,
            population,
            bars,
            agents,
            savedAgents,
            mutationRate,
            selectionMethod,
            crossOverMethod
        );

        initializeBars(bars, BAR_WIDTH, height, width)

    }
}

function start(){
    population = populationInput.value;
    crossOverMethod = crossOverMethodSelect.value;
    selectionMethod = selectionMethodSelect.value;
    mutationRate = mutationRateInput.value;

    if(population < 1){
        alert("Invalid population!");
        return
    }

    if(!crossOverMethod){
        alert("Choose a crossover method!");
        return
    }

    if(!selectionMethod){
        alert("Choose a selectionMethod");
        return
    }

    if((mutationRate < 0) || (mutationRate > 1)){
        alert("Invalid Mutation rate!");
        return
    }

    active = true;
    modal.style.visibility = "hidden";

    // create bars
    initializeBars(bars, BAR_WIDTH, height, width);

    // create agents
    initializeAgents(agents, population, height, AGENT_HEIGHT, AGENT_WIDTH);
}