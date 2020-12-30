use crate::vec2d::Vec2D;
use crate::enemy::Enemy;
use crate::electro::ChargeSpace;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Copy, Clone)]
pub struct Player {
    pub pos: Vec2D,
    pub charge_sign: i8,
    pub hp: i8,
    pub speed: f32,
}

impl Player {
    pub fn move_in_direction (&mut self, x: f32, y: f32) {
        let direction = Vec2D{x, y};
        self.pos = self.pos + self.speed * direction.norm();
    }
    pub fn switch_charge (&mut self) {
        self.charge_sign *= -1;
    }

    pub fn update(&mut self, delta: f32, charge_space: &mut ChargeSpace, enemies: &Vec<Enemy>) {
        let n = charge_space.len();

        for i in (0..n).rev() {
            let r = charge_space.phase[i].p - self.pos;
            let f = charge_space.k * (self.charge_sign as f32) * (charge_space.sign[i] as f32)
                * (r.abs() - 4.0).max(4.0).powi(-3) * r;

            charge_space.phase[i].v = charge_space.phase[i].v + delta * f;
        }
    }
}


