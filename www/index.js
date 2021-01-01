import * as wasm from "chargeback-game";

import { renderPlayer, drawBackground, renderCharges, drawDebugMenu, renderEnemies } from './render';
import { player_interaction, addListeners } from "./interaction";

let options = {
    DEBUG: true
}

let universe = new wasm.Universe();
console.log(universe);

const canvas = document.getElementById("chargeback-canvas");
canvas.width = 600;
canvas.height = 800;
const ctx = canvas.getContext('2d');
addListeners(options);

const time = (func) => {
    let before = performance.now();
    func();
    let after = performance.now();
    return after - before;
}

const renderLoop = () => {

    let tick_time = time(universe.tick.bind(universe));

    let render_time = time( () => {
        drawBackground(canvas, ctx);
        renderCharges(ctx, universe);
        renderEnemies(ctx, universe);
        renderPlayer(ctx, universe);
    });

    if(options.DEBUG) {
        drawDebugMenu(canvas, ctx, universe, tick_time, render_time);
    }

    universe.interact(player_interaction.right - player_interaction.left,
                      player_interaction.down - player_interaction.up,
                         player_interaction.switch_charge);
    player_interaction.switch_charge = false;

    requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
