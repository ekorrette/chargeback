mod utils;
mod vec2d;
mod electro;
mod player;
mod enemy;

use std::vec::Vec;

use rand::Rng;
use wasm_bindgen::prelude::*;

use vec2d::Vec2D;
use electro::ChargeSpace;
use electro::ChargePhase;
use player::Player;
use enemy::Enemy;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub struct Universe {
    t: f32,
    k: f32,
    delta: f32,
    width: f32,
    height: f32,
    rng: rand::rngs::ThreadRng,
    charge_space: ChargeSpace,
    player: Player,
    enemies: Vec<Enemy>,
}

#[wasm_bindgen]
impl Universe {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Universe {
        utils::set_panic_hook();
        let t: f32 = 0.0;
        let k: f32 = 1e6;
        let delta: f32 = 0.0166;
        let width: f32 = 600.0;
        let height: f32 = 800.0;

        Universe {
            t, k, delta, width, height, rng: rand::thread_rng(),
            charge_space: ChargeSpace::new(),
            player: Player { pos: Vec2D { x: width/2.0, y: height/2.0 }, charge_sign: 1 },
            enemies: Vec::new(),
        }
    }

    pub fn populate(&mut self, n: usize) {
        self.charge_space.clear();
        for _ in 0..n {
            self.charge_space.push(
                Vec2D {
                    x: self.rng.gen_range(0.0, self.width),
                    y: self.rng.gen_range(0.0, self.height),
                },
                Vec2D { x: 0.0, y: 0.0, },
                2*self.rng.gen_range(0, 2) - 1,
            );
        }
    }

    pub fn charges_cnt(&self) -> usize {
        self.charge_space.len()
    }
    pub fn phases_ptr(&self) -> *const ChargePhase {
        self.charge_space.phase.as_ptr()
    }
    pub fn signs_ptr(&self) -> *const i8 {
        self.charge_space.sign.as_ptr()
    }

    pub fn tick(&mut self) {
        let n = self.charge_space.len();
        for i in 0..n {
            for j in 0..n {
                let r = self.charge_space.phase[i].p - self.charge_space.phase[j].p;
                self.charge_space.phase[i].v = self.charge_space.phase[i].v
                    + self.k * self.delta * (self.charge_space.sign[i] as f32) * (self.charge_space.sign[j] as f32)
                        * r.abs().max(4.0).powi(-3) * r;
            }
        }
        for i in 0..n {
            let p1 = self.charge_space.phase[i].p + self.delta * self.charge_space.phase[i].v;
            if p1.x < 0.0 || p1.x > self.width {
                self.charge_space.phase[i].v.x *= -1.0;
            } else if p1.y < 0.0 /* || p1.y > self.height */ {
                self.charge_space.phase[i].v.y *= -1.0;
            } else {
                self.charge_space.phase[i].p = p1;
            }
        }

        for enemy in self.enemies.iter_mut() {
            enemy.act(self.t, &self.player, &mut self.rng);
        }
        self.t += self.delta;
    }
}
