import { memory } from "chargeback-game/chargeback_bg";

import * as wasm from "chargeback-game";

let DEBUG = true;

let universe = new wasm.Universe();
console.log(universe);
universe.populate(200);
console.log(new Float32Array(memory.buffer, universe.phases_ptr(), 4*universe.charges_cnt()));

let player_interaction = {
    'x': 0, 'y': 0, 'switch_charge': false
}

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
        if(i == 0) {
            console.log(x, y, positions[2], positions[3]);
        }
        if(sign != 1 && sign != -1) {
            console.log("Charge has sign", sign, "?")
        }

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

const renderPlayer = () => {
    let x = universe.get_player_x();
    let y = universe.get_player_y();
    let charge = universe.get_player_charge();

    ctx.beginPath();
    ctx.rect(x, y, 50, 50);
    if(charge > 0) {
        ctx.fillStyle = "blue";
    }
    else {
        ctx.fillStyle = "red";
    }
    ctx.fill();
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

const drawDebugMenu = (universe, tick_time, render_time) => {
    let debug = {
        width: 150,
        height: 80
    }
    ctx.fillStyle = "black";

    ctx.font = '10px monospace';
    ctx.fillText(`Tick time: ${tick_time.toFixed(2)} ms`, canvas.width - debug.width, canvas.height - debug.height)
    ctx.fillText(`Render time: ${render_time.toFixed(2)} ms`, canvas.width - debug.width, canvas.height - debug.height + 20)
    ctx.fillText(`Charge count: ${universe.charges_cnt()} `, canvas.width - debug.width, canvas.height - debug.height + 40)
}

document.addEventListener('keydown', (event) => {
    const key_name = event.key;

    console.log(key_name);

    switch (key_name) {
        case 'ArrowUp': player_interaction.y = -1; break;
        case 'ArrowDown': player_interaction.y = 1; break;
        case 'ArrowLeft': player_interaction.x = -1; break;
        case 'ArrowRight': player_interaction.x = 1; break;
        case ' ': player_interaction.switch_charge = true; break;
    }
}, false);

document.addEventListener('keyup', (event) => {
    const key_name = event.key;

    switch (key_name) {
        case 'ArrowUp': player_interaction.y = 0; break;
        case 'ArrowDown': player_interaction.y = 0; break;
        case 'ArrowLeft': player_interaction.x = 0; break;
        case 'ArrowRight': player_interaction.x = 0; break;
    }
}, false);


const renderLoop = () => {

    let tick_time = time(universe.tick.bind(universe));

    drawBackground();

    let render_time = time( () => {
        renderCharges();
        renderPlayer();
    });

    if(DEBUG) {
        drawDebugMenu(universe, tick_time, render_time);
    }

    universe.interact(player_interaction.x, player_interaction.y, player_interaction.switch_charge);
    player_interaction.switch_charge = false;

    requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
