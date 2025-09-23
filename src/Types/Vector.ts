export interface Vec2 {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export namespace Vec2 {
  export const Zero: Vec2 = { x: 0, y: 0 };
}

export namespace Size {
  export const Zero: Size = { width: 0, height: 0 };
}