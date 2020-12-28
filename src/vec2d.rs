use std::ops;

#[derive(Clone, Copy, Debug)]
pub struct Vec2D {
    pub x: f32,
    pub y: f32,
}
impl Vec2D {
    pub fn abs(self) -> f32 {
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
