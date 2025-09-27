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
  export const Equals = (a: Vec2, b: Vec2) => {
    return a.x === b.x && a.y === b.y;
  };
}

export namespace Size {
  export const Zero: Size = { width: 0, height: 0 };
  export const Equals = (a: Size, b: Size) => {
    return a.width === b.width && a.height === b.height;
  };
}