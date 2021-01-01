use crate::vec2d::Vec2D;

pub struct ChargePhase {
    pub p: Vec2D,
    pub v: Vec2D,
}

pub struct ChargeSpace {
    pub k: f32,
    pub phase: Vec<ChargePhase>,
    pub sign: Vec<i8>,
}

impl ChargeSpace {
    pub fn new(k: f32) -> ChargeSpace {
        ChargeSpace { k, phase: Vec::new(), sign: Vec::new() }
    }

    pub fn clear(&mut self) {
        self.phase.clear();
        self.sign.clear();
    }

    pub fn len(&self) -> usize {
        self.phase.len()
    }

    pub fn push(&mut self, p: Vec2D, v: Vec2D, s: i8) {
        self.phase.push(ChargePhase {p, v});
        self.sign.push(s);
    }

    pub fn pop(&mut self, i: usize) {
        self.phase.remove(i); self.sign.remove(i);
    }

    pub fn exerted_force(&self, p: Vec2D, sign: i8) -> Vec2D {
        let n = self.len();
        let mut f = Vec2D { x: 0.0, y: 0.0 };
        for i in 0..n {
            let r = p - self.phase[i].p;
            f = f + self.k * (sign as f32) * (self.sign[i] as f32)
                 * r.abs().max(4.0).powi(-3) * r;
        }
        f
    }

    pub fn kinetic_tick(&mut self, delta: f32, width: f32, height: f32) {
        let n = self.len();
        for i in 0..n {
            self.phase[i].v = self.phase[i].v + delta * self.exerted_force(self.phase[i].p, self.sign[i]);
        }
        for i in 0..n {
            let p1 = self.phase[i].p + delta * (self.phase[i].v + Vec2D { x: 0.0, y: 20.0 });
            if p1.x < 0.0 || p1.x > width {
                self.phase[i].v.x *= -1.0;
            } else if p1.y < 0.0 /* || p1.y > height */ {
                self.phase[i].v.y *= -1.0;
            } else {
                self.phase[i].p = p1;
            }
        }
        for i in (0..n).rev() {
            let p = self.phase[i].p;
            if (p.x < 0.0 || p.x > width || p.y < 0.0 || p.y > height) || (p.x.is_nan() || p.y.is_nan()) {
                self.pop(i);
            }
        }
    }

}
