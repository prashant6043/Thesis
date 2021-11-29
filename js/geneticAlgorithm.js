function rankSelection(fitness){
    let selection = []

    // make list with indices and values
    let indexedFitness = fitness.map(
        function(e, i){
            return {
                ind: i,
                val: e
            }
        });

    // sort index/value couples, based on values
    indexedFitness.sort(function(x, y){
        return x.val > y.val ? 1 : x.val == y.val ? 0 : -1
    });

    // make list keeping only indices
    let ranks = indexedFitness.map(function(e){return e.ind});

    let totalRank = 0;

    // set agent fitness
    for (let i=0;i < ranks.length;i++) {
        totalRank += ranks[i]+1;
        selection.push(1 / ranks[i]+1);
    }

    // set agent fitness
    for (let i=0;i < selection.length;i++) {
        selection[i] /= totalRank;
    }

    return selection;
}

function rouletteWheelSelection(fitness){
    let selection = [];
    let totalFitness = 0;

    // get total fitness
    for (let f of fitness) {
        totalFitness += f;
    }

    // get fitness
    for (let f of fitness) {
        selection.push(f / totalFitness)
    }

    return selection;
}

function tournamentSelection(fitness){
    let selection = [];

    // get fitness
    for (let f of fitness) {
        selection.push(1 / fitness.length)
    }

    return selection;
}

function calculateFitness(savedAgents) {
    let fitness = [];

    // set fitness score
    for (let agent of savedAgents) {
        agent.fitness = agent.score;
        fitness.push(agent.score);
    }

    return fitness;
}

function runSelection(selection, savedAgents){
    let index = 0;
    let r = random(1);

    while (r > 0) {
        r = r - selection[index];
        index++;
    }
    index--;

    return savedAgents[index];
}

function crossOver(maxHeight, agentHeight, agentWidth, parent1, parent2, crossOverMethod) {
    let firstPoint, secondPoint;
    if(crossOverMethod === "singlePointCrossOver"){
        firstPoint = 0.25;
        secondPoint = 1;

    }else if(crossOverMethod === "twoPointCrossOver"){
        firstPoint = 0.1;
        secondPoint = 0.9;

    }

    // crossing over
    let child = createAgent(
        maxHeight,
        agentHeight,
        agentWidth,
        parent1.network,
        parent2.network,
        firstPoint,
        secondPoint
    );

    return child;
}

function nextGeneration(
    maxHeight,
    agentHeight,
    agentWidth,
    maxScore,
    population,
    bars,
    agents,
    savedAgents,
    mutationRate,
    selectionMethod,
    crossOverMethod) {

    maxScore = 0;
    let fitness = calculateFitness(savedAgents);
    let selection;

    if(selectionMethod === "rouletteWheelSelection"){
        selection = rouletteWheelSelection(fitness)

    }else if(selectionMethod === "tournamentSelection"){
        selection = tournamentSelection(fitness)

    }else if(selectionMethod === "rankSelection"){
        selection = rankSelection(fitness)
    }

    // complete selection
    let parent1, parent2;

    for (let i = 0; i < population; i++) {
        parent1 = runSelection(selection, savedAgents);
        parent2 = runSelection(selection, savedAgents);

        // run cross over
        agents[i] = crossOver(maxHeight, agentHeight, agentWidth, parent1, parent2, crossOverMethod);

        // mutate
        agents[i].mutate(mutationRate);
    }

    for (let i = 0; i < population; i++) {
        savedAgents[i].dispose();

    }

    savedAgents.splice(0, savedAgents.length);
    bars.splice(0, bars.length);
}