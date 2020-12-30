import {memory} from "../pkg/chargeback_bg";

const POSITIVE_COLOR = 'blue'
const NEGATIVE_COLOR = 'red'
const BACKGROUND_COLOR = 'black'

const renderCharges = (ctx, universe) => {

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

const renderEnemies = (ctx, universe) => {

}

const renderPlayer = (ctx, universe) => {
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

const drawBackground = (canvas, ctx) => {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fill();
}

const drawDebugMenu = (canvas, ctx, universe, tick_time, render_time) => {
    let debug = {
        width: 150,
        height: 80
    }
    ctx.fillStyle = "white";

    ctx.font = '10px monospace';
    ctx.fillText(`Tick time: ${tick_time.toFixed(2)} ms`, canvas.width - debug.width, canvas.height - debug.height)
    ctx.fillText(`Render time: ${render_time.toFixed(2)} ms`, canvas.width - debug.width, canvas.height - debug.height + 20)
    ctx.fillText(`Charge count: ${universe.charges_cnt()} `, canvas.width - debug.width, canvas.height - debug.height + 40)
}

export { renderPlayer, drawBackground, renderCharges, drawDebugMenu, renderEnemies }
