use crate::vec2d::Vec2D;

pub struct ChargePhase {
    pub p: Vec2D,
    pub v: Vec2D,
}

pub struct ChargeSpace {
    pub phase: Vec<ChargePhase>,
    pub sign: Vec<i8>,
}

impl ChargeSpace {
    pub fn new() -> ChargeSpace {
        ChargeSpace { phase: Vec::new(), sign: Vec::new() }
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

}
