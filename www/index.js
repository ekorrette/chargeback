import { memory } from "chargeback/chargeback_bg";

import * as wasm from "chargeback-game";

wasm.greet();

const canvas = document.getElementById("chargeback-canvas");
canvas.height = 600;
canvas.width = 800;
