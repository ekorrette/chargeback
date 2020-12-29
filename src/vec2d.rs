use std::ops;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Vec2D {
    pub x: f32,
    pub y: f32,
}
impl Vec2D {
    pub fn abs(self) -> f32 {
        self.x.hypot(self.y)
    }
    pub fn norm(self) -> Vec2D {
        let abs = self.abs();
        return if abs > 0.0 {
            self / abs
        } else {
            self
        }
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
impl ops::Mul<f32> for Vec2D {
    type Output = Vec2D;
    fn mul(self, a: f32) -> Vec2D {
        Vec2D { x: self.x * a, y: self.y * a }
    }
}
impl ops::Div<f32> for Vec2D {
    type Output = Vec2D;
    fn div(self, a: f32) -> Vec2D {
        Vec2D { x: self.x / a, y: self.y / a }
    }
}
