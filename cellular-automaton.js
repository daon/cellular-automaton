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

// First generation
let cells = Array(100)
    .fill(1)
    .map(() => createCell(getRandomBinary()));

let firstGeneration = createRow(cells);

let cellularAutomaton = document.getElementById('cellular-automaton');
cellularAutomaton.appendChild(firstGeneration);

function cloneRow(row) {
    return row.cloneNode(true);
}

let nextGeneration = cloneRow(firstGeneration);
cellularAutomaton.appendChild(nextGeneration);
