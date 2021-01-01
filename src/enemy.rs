use rand::Rng;
use crate::vec2d::Vec2D;
use crate::player::Player;
use crate::electro::ChargeSpace;

use wasm_bindgen::prelude::*;

const ENEMY_DIRECTIONS: usize = 16;

#[wasm_bindgen]
#[derive(Debug, Copy, Clone, PartialEq)]
pub enum EnemyState {
    RandShooter,
    RandShooterSleeping,
    Dead,
}

#[wasm_bindgen]
#[derive(Debug, Copy, Clone)]
pub struct Enemy {
    pub id: i32,
    pub pos: Vec2D,
    pub hp: i8,
    pub t0: f32,
    pub frames: i32,
    pub state: EnemyState
}


impl Enemy {
    pub fn act(&mut self, t: f32, delta: f32, charge_space: &mut ChargeSpace, player: &Player, enemy_pos: &Vec<Vec2D>, rng: &mut rand::rngs::ThreadRng) {
        let n = charge_space.len();

        for i in 0..n.checked_sub(2).unwrap_or(0) {
            let p = charge_space.phase[i].p;
            if self.collision(p.x, p.y) {
                self.collision_handler(charge_space, i);
                break;
            }
        }


        if self.state == EnemyState::RandShooterSleeping {
            if rng.gen_range(0, 60) == 0  {
                self.state = EnemyState::RandShooter;
            }
        }
        if self.state == EnemyState::RandShooter {
            if rng.gen_range(0, 20) == 0 && player.pos != self.pos {
                let v: Vec2D = rng.gen_range(20.0, 40.0) * (player.pos - self.pos).norm();
                let s: i8 = 2*rng.gen_range(0, 2) - 1;
                charge_space.push(self.pos, v, s);
                self.state = EnemyState::RandShooterSleeping;
            }
        }

        let dirs = (0..ENEMY_DIRECTIONS).map(|i| self.grade_direction(i, charge_space, player, enemy_pos));
        let best = dirs.max_by(|x, y| (x.0).partial_cmp(&y.0).unwrap());
        let (priority, direction) = match best {
            Some(x) => x,
            None => (0.0, Vec2D::zero()),
        };
        self.pos = self.pos + delta * direction * 80.0 * priority.max(0.0).tanh();
        // self.pos.x = self.pos.x.max(30.0).min(570.0);
        // self.pos.y = self.pos.y.max(40.0).min(760.0);
    }

    pub fn grade_direction(&self, i: usize, charge_space: &ChargeSpace, player: &Player, enemy_pos: &Vec<Vec2D>) -> (f32, Vec2D) {
        let vec = Vec2D::polar(std::f32::consts::TAU * (i as f32) / (ENEMY_DIRECTIONS as f32));
        let mut val = 0.0f32;

        // Charges (chaos)
        for phase in charge_space.phase.iter() {
            val += vec.dot((phase.p - self.pos).norm()) * -1.0 * (-(phase.p - self.pos).abs()/40.0 - 1.0).exp();
        }

        // Player
        val += vec.dot((player.pos - self.pos).norm()) * ((player.pos - self.pos).abs()/300.0 - 1.0).tanh() * (if (player.pos - self.pos).abs() < 300.0 { 2.0 } else { 1.0 });
        val += (1.0 - (0.65 - vec.dot((player.pos - self.pos).norm())).abs()) / 1.5;

        // Co-Enemies
        for pos in enemy_pos.iter() {
            val += vec.dot((*pos - self.pos).norm()) * -3.0 * (-(*pos - self.pos).abs()/100.0 - 1.0).exp();
        }

        // Screen
        let vert = if self.pos.y > 150.0 { -(self.pos.y - 150.0) / 300.0 } else { ((150.0 - self.pos.y)/50.0).exp() - 1.0 };
        val += vec.dot(Vec2D {x: 0.0, y: 1.0}) * vert;
        let hori = (if 100.0 <= self.pos.x && self.pos.x <= 500.0 { 0.0 } else { (100.0 - self.pos.x).max(self.pos.x - 500.0 ) }) / 50.0;
        val += vec.dot(Vec2D {x: 1.0, y: 0.0}) * (hori.exp() - 1.0) * (if self.pos.x < 300.0 { 1.0 } else { -1.0 });


        (val, vec)
    }

    pub fn collision(&self, x:f32, y:f32) -> bool {
        // 34, 33    //40*5/6 .-.
        // rect: 6:61, 10:33
        let xcol = self.pos.x - x - 3.0 <= 28.0 && x - self.pos.x - 3.0 <=27.0;
        let ycol = self.pos.y - y - 3.0 <= 23.0 && y - self.pos.y - 3.0 <= 0.0;
        return xcol && ycol;
    }

    fn collision_handler(&mut self, charge_space: &mut ChargeSpace, i:usize) {
        self.hp -= 1;
        charge_space.pop(i);

        if self.hp <= 0 {
            self.explode();
        }
    }

    fn explode(&mut self) {
        self.state = EnemyState::Dead;
    }
}
