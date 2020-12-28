import { memory } from "chargeback-game/chargeback_bg";

import * as wasm from "chargeback-game";

let universe = new wasm.Universe();
universe.populate(100);

// wasm.greet();

const canvas = document.getElementById("chargeback-canvas");
canvas.width = 600;
canvas.height = 800;
const ctx = canvas.getContext('2d');

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
    drawTestRects();
    requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
