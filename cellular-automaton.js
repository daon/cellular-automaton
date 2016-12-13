'use strict';

function getRandomBinary() {
    return Math.floor(Math.random() * 2);
}

function createCell(active) {
    active = !!active;
    const state = active ? 'active' : 'inactive';
    let cell = document.createElement('div');
    cell.classList.add('cell', state);
    return cell;
}

function createRow(cells) {
    cells = cells || [];
    let row = document.createElement('div');
    row.classList.add('row');
    cells.forEach((cell) => row.appendChild(cell));
    return row;
}

function cloneRow(row) {
    return row.cloneNode(true);
}

function getNextGeneration(rules, lastGeneration) {
    let nextGeneration = cloneRow(lastGeneration);

    for(let i = 0; i < nextGeneration.childNodes.length; i++) {
        let target = nextGeneration.childNodes[i];
        let prevSelf = lastGeneration.childNodes[i];
        let prevLeft = prevSelf.previousElementSibling || lastGeneration.childNodes[lastGeneration.childNodes.length - 1];
        let prevRight = prevSelf.nextElementSibling || lastGeneration.childNodes[0]; 
        let prevStates = getStates(prevLeft, prevSelf, prevRight);
        let nextState = getNextState(rules, prevStates);
        setState(target, nextState);
    }
    return nextGeneration;
}

function getStates(left, self, right) {
    return [
        getState(left),
        getState(self),
        getState(right)
    ];
}

function getState(cell) {
   return cell.classList.contains('active');
}

function setState(cell, state) {
    let className = state ? 'active' : 'inactive';
    cell.classList.remove('active');
    cell.classList.remove('inactive');
    cell.classList.add(className);
}

function getNextState(rules, prevStates) {
    for (let i = 0; i < rules.length; i++) {
        if (prevStates[0] === !!rules[i].states[0] && 
        prevStates[1] === !!rules[i].states[1] && 
        prevStates[2] === !!rules[i].states[2]) {
            return rules[i].nextState;
        }
    }
}

function loadJSON(file, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); 
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

let initialConditions = {
    random: function () {
        return Array(101)
            .fill(1)
            .map(() => createCell(getRandomBinary()));
    },
    simple: function () {
        return Array(50).fill(0)
            .concat(Array(1).fill(1))
            .concat(Array(50).fill(0))
            .map((active) => createCell(active));
    }
};

let renderInterval;
let cellularAutomaton = document.getElementById('cellular-automaton');
let rulesElement = document.getElementById('rules');
let rulesCollections;
loadJSON('rules-collections.json', (response) => {
    rulesCollections = JSON.parse(response);
    Object
        .keys(rulesCollections)
        .forEach((rulesCollection) => {
            let option = document.createElement('option');
            option.text = rulesCollection;
            rulesElement.appendChild(option);
        });
})

function render() {
    // First generation
    let initialCondition = document.querySelector('input[type=radio]:checked');
    let cells = initialConditions[initialCondition.value]();
    let firstGeneration = createRow(cells);
    let rulesCollection = rulesElement.selectedOptions[0].value;
    let rules = rulesCollections[rulesCollection];

    cellularAutomaton.appendChild(firstGeneration);

    renderInterval = setInterval(() => {
        let lastGeneration = document.querySelector('.row:last-child');
        let nextGeneration = getNextGeneration(rules, lastGeneration);
        cellularAutomaton.appendChild(nextGeneration);
    }, 100);
}

 function reset() {
    clearInterval(renderInterval);
    cellularAutomaton.innerHTML = '';
}