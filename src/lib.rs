mod utils;
mod vec2d;
mod player;

use std::vec::Vec;

use rand::Rng;
use wasm_bindgen::prelude::*;

use vec2d::Vec2D;
use player::Player;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[derive(Clone, Copy, Debug)]
pub struct ChargePhase {
    p: Vec2D,
    v: Vec2D,
}

#[wasm_bindgen]
pub struct Universe {
    t: f32,
    k: f32,
    delta: f32,
    width: f32,
    height: f32,
    charge_phase: Vec<ChargePhase>,
    charge_sign: Vec<i8>,
    player: Player,
}

#[wasm_bindgen]
impl Universe {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Universe {
        utils::set_panic_hook();
        let t: f32 = 0.0;
        let k: f32 = 1e6;
        let delta: f32 = 1e-2;
        let width: f32 = 600.0;
        let height: f32 = 800.0;
        let charge_phase = Vec::new();
        let charge_sign = Vec::new();

        Universe {
            t, k, delta, width, height,
            charge_phase, charge_sign,
            player: Player { pos: Vec2D { x: width/2.0, y: height/2.0 }, charge_sign: 1 },
        }
    }

    pub fn populate(&mut self, n: usize) {
        self.charge_phase.clear();
        self.charge_sign.clear();
        let mut rng = rand::thread_rng();
        for _ in 0..n {
            self.charge_phase.push(ChargePhase {
                p: Vec2D {
                    x: rng.gen_range(0.0, self.width),
                    y: rng.gen_range(0.0, self.height),
                },
                v: Vec2D { x: 0.0, y: 0.0, },
            });
            self.charge_sign.push(2*rng.gen_range(0, 2) - 1);
        }
    }

    pub fn charges_cnt(&self) -> usize {
        self.charge_phase.len()
    }
    pub fn phases_ptr(&self) -> *const ChargePhase {
        self.charge_phase.as_ptr()
    }
    pub fn signs_ptr(&self) -> *const i8 {
        self.charge_sign.as_ptr()
    }

    pub fn tick(&mut self) {
        let n = self.charge_phase.len();
        for i in 0..n {
            for j in 0..n {
                let r = self.charge_phase[i].p - self.charge_phase[j].p;
                self.charge_phase[i].v = self.charge_phase[i].v
                    + self.k * self.delta * (self.charge_sign[i] as f32) * (self.charge_sign[j] as f32)
                        * r.abs().max(4.0).powi(-3) * r;
            }
        }
        for i in 0..n {
            let p1 = self.charge_phase[i].p + self.delta * self.charge_phase[i].v;
            if p1.x < 0.0 || p1.x > self.width {
                self.charge_phase[i].v.x *= -1.0;
            } else if p1.y < 0.0 /* || p1.y > self.height */ {
                self.charge_phase[i].v.y *= -1.0;
            } else {
                self.charge_phase[i].p = p1;
            }
        }
        self.t += self.delta;
    }
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, chargeback!!");
}
