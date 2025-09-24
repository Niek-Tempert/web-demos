import { RefObject } from "react";
import { Size, Vec2 } from "./Vector";

export interface MovableProps {
    children?: React.ReactNode;
    position?: Vec2;
    dragRef?: RefObject<HTMLDivElement | null>;
    onMove?: (e: MouseEvent, position: Vec2) => void;
}

export interface MovableState {
    position: Vec2;
    isDragging: boolean;
    dragStart: Vec2;
}

export interface ResizeableProps extends MovableProps {
    size?: Size,
    minSize?: Size,
}

export interface ResizeableState {
    position: Vec2,
    size: Size,
    isResizing: boolean,
    resizeStartPos: Vec2,
    resizeStartSize: Size,
    selectedCorner: Corner,
}

export enum Corner {
    None = 0,
    Left = 1 << 0,
    Right = 1 << 1,
    Top = 1 << 2,
    Bottom = 1 << 3,
    TopLeft = Top | Left,
    BottomLeft = Bottom | Left,
    TopRight = Top | Right,
    BottomRight = Bottom | Right,
}