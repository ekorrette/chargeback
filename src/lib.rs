mod utils;

use std::vec::Vec;
use std::ops;
use rand::Rng;
use wasm_bindgen::prelude::*;

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
pub struct Vec2D {
    x: f32,
    y: f32,
}
impl Vec2D {
    fn abs(self) -> f32 {
        return self.x.hypot(self.y);
    }
}
impl ops::Add<Vec2D> for Vec2D {
    type Output = Vec2D;
    fn add(self, other: Vec2D) -> Vec2D {
        Vec2D { x: self.x + other.x, y: self.y + other.y }
    }
}
impl ops::Sub<Vec2D> for Vec2D {
    type Output = Vec2D;
    fn sub(self, other: Vec2D) -> Vec2D {
        Vec2D { x: self.x - other.x, y: self.y - other.y }
    }
}
impl ops::Mul<Vec2D> for f32 {
    type Output = Vec2D;
    fn mul(self, v: Vec2D) -> Vec2D {
        Vec2D { x: self * v.x, y: self * v.y }
    }
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
    width: f32,
    height: f32,
    delta: f32,
    charge_phase: Vec<ChargePhase>,
    charge_sign: Vec<i8>,
}

#[wasm_bindgen]
impl Universe {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Universe {
        let t: f32 = 0.0;
        let charge_phase = Vec::new();
        let charge_sign = Vec::new();

        Universe {
            t,
            k: 1e6,
            width: 600.0,
            height: 800.0,
            delta: 1e-2,
            charge_phase,
            charge_sign,
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
                if(r.abs() >= 1e-9) {
                    self.charge_phase[i].v = self.charge_phase[i].v
                        + self.k * self.delta * (self.charge_sign[i] as f32) * (self.charge_sign[j] as f32)
                         * r.abs().powi(-3) * r;
                }
            }
        }
        for i in 0..n {
            self.charge_phase[i].p = self.charge_phase[i].p + self.delta * self.charge_phase[i].v;
        }
    }
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, chargeback!!");
}
