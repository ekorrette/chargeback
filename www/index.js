import { memory } from "chargeback-game/chargeback_bg";

import * as wasm from "chargeback-game";

let universe = new wasm.Universe();
console.log(universe);
universe.populate(100)
console.log(new Float32Array(memory.buffer, universe.phases_ptr(), 4*universe.charges_cnt()));

// wasm.greet();

const canvas = document.getElementById("chargeback-canvas");
canvas.width = 600;
canvas.height = 800;
const ctx = canvas.getContext('2d');

const renderMissiles = () => {

    let array = new Float32Array(memory.buffer, universe.phases_ptr(), 4*universe.charges_cnt());

    for(let i = 0; i < universe.charges_cnt(); i++) {
        let x = array[4*i];
        let y = array[4*i+1];

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    }
}

const drawBackground = () => {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fill();
}

const drawTestRects = () => {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(20, 20, 150, 100);
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(40, 40, 150, 100);
    ctx.fillStyle = "blue";
    ctx.fill();
};


const renderLoop = () => {
    drawBackground();
    renderMissiles();
    requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
