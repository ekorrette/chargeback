use rand::Rng;
use crate::vec2d::Vec2D;
use crate::player::Player;
use crate::electro::ChargeSpace;

#[derive(PartialEq)]
pub enum EnemyState {
    RandShooter,
    RandShooterSleeping,
}

pub struct Enemy {
    pub id: i32,
    pub pos: Vec2D,
    pub hp: i8,
    pub t0: f32,
    pub state: EnemyState
}

impl Enemy {
    pub fn act(&mut self, t: f32, player: &Player, charge_space: &mut ChargeSpace, rng: &mut rand::rngs::ThreadRng) {
        if self.state == EnemyState::RandShooterSleeping {
            if rng.gen_range(0, 60) == 0  {
                self.state = EnemyState::RandShooter;
            }
        }
        if self.state == EnemyState::RandShooter {
            if rng.gen_range(0, 20) == 0 {
                self.state = EnemyState::RandShooterSleeping;
            }
        }
    }
}