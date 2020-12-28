import { memory } from "chargeback-game/chargeback_bg";

import * as wasm from "chargeback-game";

let universe = new wasm.Universe();
console.log(universe);
universe.populate(20);
console.log(new Float32Array(memory.buffer, universe.phases_ptr(), 4*universe.charges_cnt()));

// wasm.greet();

const canvas = document.getElementById("chargeback-canvas");
canvas.width = 600;
canvas.height = 800;
const ctx = canvas.getContext('2d');

const renderCharges = () => {

    let positions = new Float32Array(memory.buffer, universe.phases_ptr(), 4*universe.charges_cnt());
    let signs = new Int8Array(memory.buffer, universe.signs_ptr(), universe.charges_cnt());

    for(let i = 0; i < universe.charges_cnt(); i++) {
        let x = positions[4 * i];
        let y = positions[4 * i + 1];
        let sign = signs[i];

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        if (sign > 0) {
            ctx.fillStyle = "blue";
        }
        else {
            ctx.fillStyle = "red";
        }
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

const time = (func) => {
    let before = performance.now();
    func();
    let after = performance.now();
    return after - before;
}

const drawDebugMenu = (ticktime, rendertime) => {
    let debug = {
        width: 150,
        height: 50
    }

    ctx.fillText(`Tick time: ${(ticktime*100).toFixed(2)}`, canvas.width - debug.width, canvas.height - debug.height)
    ctx.fillText(`Render time: ${(rendertime*100).toFixed(2)}`, canvas.width - debug.width, canvas.height - debug.height + 20)
}


const renderLoop = () => {

    let ticktime = time(universe.tick.bind(universe));

    drawBackground();

    let rendertime = time(renderCharges);

    drawDebugMenu(ticktime, rendertime);

    requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
