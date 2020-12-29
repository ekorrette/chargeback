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
use enemy::EnemyState;

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
    delta: f32,
    width: f32,
    height: f32,
    rng: rand::rngs::ThreadRng,
    charge_space: ChargeSpace,
    player: Player,
    next_enemy_id: i32,
    enemies: Vec<Enemy>,
}

impl Universe {
    pub fn spawn_enemy(&mut self, pos: Vec2D, hp: i8, state: EnemyState) {
        self.enemies.push(Enemy {id: self.next_enemy_id, pos, hp, t0: self.t, frames: 0, state});
        self.next_enemy_id += 1;
    }
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

        let mut uni = Universe {
            t, delta, width, height, rng: rand::thread_rng(),
            charge_space: ChargeSpace::new(k),
            player: Player { pos: Vec2D { x: width/2.0, y: height/2.0 }, charge_sign: 1, hp: 3, speed: 1.0 },
            next_enemy_id: 1, enemies: Vec::new(),
        };
        uni.spawn_enemy(Vec2D { x: 300.0, y: 200.0 }, 5, EnemyState::RandShooterSleeping);

        uni
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

    pub fn interact(&mut self, x: f32, y: f32, switch_charge: bool) {
        self.player.move_in_direction(x, y);

        if switch_charge {
            self.player.switch_charge();
        }
    }

    pub fn tick(&mut self) {
        self.charge_space.kinetic_tick(self.delta, self.width, self.height);

        for enemy in self.enemies.iter_mut() {
            enemy.act(self.t, &self.player, &mut self.charge_space, &mut self.rng);
        }
        self.t += self.delta;
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

    pub fn get_player_x (&self) -> f32 {
        return self.player.pos.x;
    }
    pub fn get_player_y (&self) -> f32 {
        return self.player.pos.y;
    }
    pub fn get_player_charge (&self) -> i8 {
        return self.player.charge_sign;
    }
}
