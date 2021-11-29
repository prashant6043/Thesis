function initializeBars(bars, barWidth, maxHeight, maxWidth){
    let newBar = createNewBar(bars, barWidth, maxHeight, maxWidth);
    updateBars(bars, newBar)
}

function createAgent(maxHeight, agentHeight, agentWidth, parent1Network=false, parent2Network=false, firstPoint=false, secondPoint=false){
    return new Agent(0, maxHeight - agentHeight, agentHeight, agentWidth, parent1Network, parent2Network, firstPoint, secondPoint);
}

function initializeAgents(agents, population, maxHeight, agentHeight, agentWidth){
    for (let i = 0; i < population; i++) {
        let newAgent = createAgent(maxHeight, agentHeight, agentWidth);
        agents.push(newAgent);
    }
}

function createNewBar(bars, barWidth, maxHeight, maxWidth){
    // the position of bars on the horizontal axis
    let x = maxWidth / 2 + random(0, maxWidth / 2);
    let y = random(maxHeight - 300, maxHeight - 150);

    return new Bar(x, y, maxHeight - y, barWidth);
}

function barOverlap(bars, bar, barWidth){
    // make sure new bar is not overlapping with older bar
    if(bars.length > 0 && bar.x <= bars[bars.length-1].x + 10 * barWidth){
        return true
    }

    return false
}

function updateBars(bars, newBar){
    bars.push(newBar)
}

function removeAgent(agents, index){
    return agents.splice(index, 1)[0];
}

function saveAgent(savedAgents, agent){
    savedAgents.push(agent);
}

function removeAndSaveAgent(agents, index, savedAgents){
    // remove agent from world
    let removedAgent = removeAgent(agents, index);

    // save the agent removed( for fitness calc)
    saveAgent(savedAgents, removedAgent);
}

function displayInfo(currentGeneration, maxScore, agents,bestScore,bestGeneration,population,selectionMethod,crossOverMethod,mutationRate){
    background(135, 206, 250);
    textSize(25);
    noStroke();
    fill(0);
    text(`Agents: ${agents.length}`, 10, 30);
    text(`Max score: ${maxScore}`, 10, 60);
    text(`Generation: ${currentGeneration}`, 10, 90);
    text(`------------------`,10,120)
    text(`Best Score: ${bestScore}`,10,150)
    text(`Best Generation: ${bestGeneration}`,10,180)
    text(`------------------`,10,210)
    text(`Population: ${population}`,10,230)
    text(`Selection Method: ${selectionMethod}`,10,260)
    text(`Crossover Method: ${crossOverMethod}`,10,290)
    text(`Mutation Rate: ${mutationRate}`,10,320)
}

function showBars(bars){
    bars.map(
        bar => {
            stroke(100, 0, 0);
            fill(0, 100, 0);
            rectMode(CORNER);
            rect(bar.x, bar.y, bar.width, bar.height);
        }
    )
}

function showAgents(agent, agentImage){
    agents.map(
        agent => {
            stroke(81, 219, 146);
            fill(0, 0, 0, 100);
            image(agentImage, agent.x, agent.y, agent.width, agent.height);
            // ellipse(agent.x, agent.y, agent.width, agent.height);
        }
    )

}
function moveBar(bar, speed){
    // set new position of bar
    bar.updatePosition(bar.x - speed, bar.y);
}

function barOffScreen(bar, edge){
    if(bar.x < edge){
        return true;
    }
    return false;
}

function removeBar(bars, index){
    bars.splice(index, 1)
}

function barAgentCollided(bar, agent){
    if((agent.y + 3 * agent.height / 4) > bar.y){
        if((agent.x + agent.width / 2 >= bar.x) &&
            (agent.x <= bar.x + bar.width)){
            return true;
        }
    }

    return false;
}

function checkBarAgentCollision(bars, agents) {
    for (let i = bars.length - 1; i >= 0; i--){
        for (let j = agents.length - 1; j >= 0; j--){
            if (barAgentCollided(bars[i], agents[j])) {
                savedAgents.push(agents.splice(j, 1)[0]);
                // alert("collision!")
            }
        }
    }
}

function agentHitGround(agent, floor){
    if(agent.y + 3 * agent.height / 4 >= floor){
        return true;
    }
    return false;
}

function agentOffScreen(agent, edge){
    if(agent.y < 0){
        return true;
    }

    if(agent.x > edge || agent.x < 0){
        return true;
    }

    return false;
}