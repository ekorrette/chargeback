import { memory } from "../pkg/chargeback_bg";

const POSITIVE_COLOR = 'blue'
const NEGATIVE_COLOR = 'red'
const BACKGROUND_COLOR = 'black'

let pos_image = new Image();
pos_image.src = "./assets/pos.png";
let neg_image = new Image();
neg_image.src = "./assets/neg.png";


let starlets = [];

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
    let width = 36;
    let height = 42;

    let player = universe.get_player();

    ctx.beginPath();
    let im = "";
    if(player.charge_sign > 0) {
        im = pos_image;
    }
    else {
        im = neg_image;
    }
    ctx.drawImage(im, player.pos.x - width/2, player.pos.y - height/2, width, height);
    // ctx.rect(player.pos.x - width/2, player.pos.y - height/2, width, height);
    // ctx.fill();
}

const drawBackground = (canvas, ctx) => {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fill();

    if(Math.random() <= 0.025) {
        starlets.push({x: Math.random() * 600.0, y: 10.0, f: Math.random() * 100.0});
    }
    while(starlets.length > 0 && starlets[0].y > 800.0) {
        starlets.shift();
    }
    starlets.forEach((starlet) => {
        starlet.y += 0.0166 * 100.0;
        starlet.f += 1;
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(starlet.x, starlet.y, (1.5+Math.sin(starlet.f/40)) * 0.6, 0, 2 * Math.PI);
        ctx.fill();
    });
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
