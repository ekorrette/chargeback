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

        self.pos.x = self.pos.x.min(600.0).max(0.0);
        self.pos.y = self.pos.y.min(800.0).max(0.0);

    }
    pub fn switch_charge (&mut self) {
        self.charge_sign *= -1;
    }

    pub fn update(&mut self, delta: f32, charge_space: &mut ChargeSpace, enemies: &Vec<Enemy>) {
        let n = charge_space.len();

        for i in (0..n).rev() {
            let p = charge_space.phase[i].p;
            if self.collision(p.x, p.y) {
                self.collision_handler(charge_space, i);
                continue;
            }

            let r = p - self.pos;
            let f = charge_space.k * (self.charge_sign as f32) * (charge_space.sign[i] as f32)
                * (r.abs() - 4.0).max(4.0).powi(-3) * r;

            charge_space.phase[i].v = charge_space.phase[i].v + delta * f;
        }
    }

    pub fn collision(&self, x:f32, y:f32) -> bool {
        let first_rect = |x, y| {
            // first rect: 0:29, 14:34
            let xcol = self.pos.x - x -3.0 <= 15.0 && x - self.pos.x - 3.0 <= 14.0;
            let ycol = self.pos.y - y -3.0 <= 3.0 && y - self.pos.y - 3.0 <= 17.0;
            xcol && ycol
        };
        let second_rect = |x,y| {
            // second rect: 8:21, 6:34
            let xcol = self.pos.x - x - 3.0 <= 7.0 && x - self.pos.x - 3.0 <= 6.0;
            let ycol = self.pos.y - y - 3.0 <= 11.0 && y - self.pos.y - 3.0 <= 17.0;
            xcol && ycol
        };

        return first_rect(x, y) || second_rect(x, y);
    }

    fn collision_handler(&mut self, charge_space: &mut ChargeSpace, i:usize) {
        self.hp -= 1;

        self.charge_sign += charge_space.sign[i];

        charge_space.pop(i);
    }
}


