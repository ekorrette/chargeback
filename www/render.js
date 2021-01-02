import { memory } from "../pkg/chargeback_bg";

const POSITIVE_COLOR = 'blue'
const NEGATIVE_COLOR = 'red'
const BACKGROUND_COLOR = 'black'

let pos_image = new Image();
pos_image.src = "./assets/pos.png";
let neg_image = new Image();
neg_image.src = "./assets/neg.png";
let enemy_image = new Image();
enemy_image.src = "./assets/enemy.png";

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

const drawHPBar = (ctx, x, y, fraction) => {
    const LENGHT = 80;
    const DIST = 50;

    let bar_x = {start: x - LENGHT/2, end: x + LENGHT/2};
    bar_x.color_switch = bar_x.start + LENGHT*fraction;

    let bar_y = y - DIST;

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'green';
    ctx.moveTo(bar_x.start, bar_y);
    ctx.lineTo(bar_x.color_switch, bar_y);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(bar_x.color_switch, bar_y);
    ctx.lineTo(bar_x.end, bar_y);
    ctx.stroke();

    ctx.lineWidth = 1;
}

const renderEnemies = (ctx, universe) => {
    let width = 68;
    let height = 40;

    for(let i = 0; i < universe.enemies_cnt(); i++) {
        let it = universe.enemies_idx(i);
        ctx.drawImage(enemy_image, it.pos.x - width/2, it.pos.y - height*5/6, width, height);
        drawHPBar(ctx, it.pos.x, it.pos.y, it.hp/5);
    }
}

const renderPlayer = (ctx, universe) => {
    let width = 30;
    let height = 35;

    let player = universe.get_player();

    let im = "";
    if(player.charge_sign > 0) {
        im = pos_image;
    }
    else {
        im = neg_image;
    }
    ctx.drawImage(im, player.pos.x - width/2, player.pos.y - height/2, width, height);
}

const drawBackground = (canvas, ctx) => {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fill();

    if(Math.random() <= 0.05) {
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

const drawDebugMenu = (canvas, ctx, universe, tick_time, render_time, touch_x, touch_y, time) => {
    const fix = (x) => {
        if(x !== null) {
            return x.toFixed(1);
        }
        else {
            return null;
        }
    }
    let debug_info = [
        `Tick time: ${tick_time.toFixed(2)} ms`,
        `Render time: ${render_time.toFixed(2)} ms`,
        `Charge count: ${universe.charges_cnt()} `,
        `HP: ${universe.get_player().hp} `,
        `Charge: ${universe.get_player().charge_sign} `,
        `Touch: ${fix(touch_x)}, ${fix(touch_y)}`,
        `Czas gry: ${time}`,
    ]

    let debug = {
        width: 150,
        height: debug_info.length * 20 + 10
    }

    ctx.fillStyle = "white";
    ctx.font = '10px monospace';

    debug_info.forEach((str, i) =>
        ctx.fillText(str, canvas.width - debug.width, canvas.height - debug.height + 20 * i)
    );

    let positions = new Float32Array(memory.buffer, universe.phases_ptr(), 4*universe.charges_cnt());
    for(let i = 0; i < universe.charges_cnt(); i++) {
        let x = positions[4 * i];
        let y = positions[4 * i + 1];
        let vx = positions[4 * i + 2];
        let vy = positions[4 * i + 3];

        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.moveTo(x, y);
        ctx.lineTo(x+vx/4, y+vy/4);
        ctx.stroke();
    }

    for(let i = 0; i < universe.enemies_cnt(); i++) {
        let it = universe.enemies_idx(i);
        for(let j = 0; j < 16; j++) {
            let alpha = 2*Math.PI*j/16;
            let pri = 100*universe.get_dbg_dir_priority(i, j);
            ctx.beginPath();
            if(pri < 0) {
                pri = -pri;
                ctx.strokeStyle = 'red';
            } else {
                ctx.strokeStyle = 'green';
            }
            ctx.moveTo(it.pos.x, it.pos.y);
            ctx.lineTo(it.pos.x + pri*Math.cos(alpha), it.pos.y + pri*Math.sin(alpha));
            ctx.stroke();
        }
    }
}

export { renderPlayer, drawBackground, renderCharges, drawDebugMenu, renderEnemies }
