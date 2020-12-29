use crate::vec2d::Vec2D;

pub struct Player {
    pub pos: Vec2D,
    pub charge_sign: i8,
    pub hp: i8,
    pub speed: f32,
}

impl Player {
    pub fn move_in_direction (&mut self, x: f32, y: f32) {
        let direction = Vec2D{x, y};
        self.pos = self.pos + self.speed * direction;
    }
    pub fn switch_charge (&mut self) {
        self.charge_sign *= -1;
    }
}


