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

function getNextGeneration(lastGeneration) {
    let nextGeneration = cloneRow(lastGeneration);

    for(let i = 0; i < nextGeneration.childNodes.length; i++) {
        let target = nextGeneration.childNodes[i];
        let prevSelf = lastGeneration.childNodes[i];
        let prevLeft = prevSelf.previousElementSibling || lastGeneration.childNodes[lastGeneration.childNodes.length - 1];
        let prevRight = prevSelf.nextElementSibling || lastGeneration.childNodes[0]; 
        let prevStates = getStates(prevLeft, prevSelf, prevRight);
        let nextState = getNextState(prevStates);
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

function getNextState(prevStates) {
    let rules = [
        { states: [true, true, true], nextState: false },
        { states: [true, false, true], nextState: false },
        { states: [true, false, false], nextState: true },
        { states: [false, true, true], nextState: false },
        { states: [false, true, false], nextState: false },
        { states: [false, false, true], nextState: true },
        { states: [false, false, false], nextState: false }
    ];

    for (let i = 0; i < rules.length; i++) {
        if (prevStates[0] === rules[i].states[0] && 
        prevStates[1] === rules[i].states[1] && 
        prevStates[2] === rules[i].states[2]) {
            return rules[i].nextState;
        }
    }
}

// First generation
let cells = Array(100)
    .fill(1)
    .map(() => createCell(getRandomBinary()));

let firstGeneration = createRow(cells);
let cellularAutomaton = document.getElementById('cellular-automaton');
cellularAutomaton.appendChild(firstGeneration);

setInterval(() => {
    let lastGeneration = document.querySelector('.row:last-child');
    let nextGeneration = getNextGeneration(lastGeneration);
    cellularAutomaton.appendChild(nextGeneration);
}, 100);

