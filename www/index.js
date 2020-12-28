// import { memory } from "chargeback/chargeback_bg";

import * as wasm from "chargeback-game";

wasm.greet();

const canvas = document.getElementById("chargeback-canvas");
canvas.width = 600;
canvas.height = 800;
const ctx = canvas.getContext('2d');

const renderLoop = () => {
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

    requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
