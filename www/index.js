import { memory } from "chargeback-game/chargeback_bg";

import * as wasm from "chargeback-game";

let DEBUG = false;
let POSITIVE_COLOR = 'blue'
let NEGATIVE_COLOR = 'red'
let BACKGROUND_COLOR = 'black'

let universe = new wasm.Universe();
console.log(universe);
universe.populate(20);

let player_interaction = {
    'left': 0, 'right': 0, 'up': 0, 'down': 0, 'switch_charge': false
}


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
            ctx.fillStyle = POSITIVE_COLOR;
        }
        else {
            ctx.fillStyle = NEGATIVE_COLOR;
        }
        ctx.fill();
    }
}

const renderPlayer = () => {
    let width = 40;
    let height = 40;

    let player = universe.get_player();

    ctx.beginPath();
    ctx.rect(player.pos.x - width/2, player.pos.y - height/2, width, height);
    if(player.charge_sign > 0) {
        ctx.fillStyle = POSITIVE_COLOR;
    }
    else {
        ctx.fillStyle = NEGATIVE_COLOR;
    }
    ctx.fill();
}

const drawBackground = () => {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fill();
}

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
        case 'ArrowUp': player_interaction.up = 1; break;
        case 'ArrowDown': player_interaction.down = 1; break;
        case 'ArrowLeft': player_interaction.left = 1; break;
        case 'ArrowRight': player_interaction.right = 1; break;
        case ' ': player_interaction.switch_charge = true; break;
        case 'F2': DEBUG = !DEBUG;
    }
}, false);

document.addEventListener('keyup', (event) => {
    const key_name = event.key;

    switch (key_name) {
        case 'ArrowUp': player_interaction.up = 0; break;
        case 'ArrowDown': player_interaction.down = 0; break;
        case 'ArrowLeft': player_interaction.left = 0; break;
        case 'ArrowRight': player_interaction.right = 0; break;
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

    universe.interact(player_interaction.right - player_interaction.left,
                      player_interaction.down - player_interaction.up,
                         player_interaction.switch_charge);
    player_interaction.switch_charge = false;

    requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
