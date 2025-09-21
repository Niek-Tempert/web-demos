'use client';
import { useEffect, useRef, useState } from "react";
import Movable, { MovableProps, MovableRef } from "./movable";

enum Corner {
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

interface ResizeableProps extends MovableProps {
    size?: Size,
}

export default function MovableResizeable(props: ResizeableProps) {
    const [currentSize, setCurrentSize] = useState(props.size || { width: 200, height: 100 });
    const [isResizing, setIsResizing] = useState(false);
    const resizeStartPos = useRef({ x: 0, y: 0 });
    const resizeStartSize = useRef({ width: 0, height: 0 });

    const [currentCorner, setCurrentCorner] = useState(Corner.None);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);
    const movableRef = useRef<MovableRef>(null);

    const getWindowCorner = (point: Vec2) => {
        let corner = Corner.None;

        if (point.x <= 5) {
            corner |= Corner.Left
        } else if (point.x >= currentSize.width - 5) {
            corner |= Corner.Right
        }

        if (point.y <= 5) {
            corner |= Corner.Top
        } else if (point.y >= currentSize.height - 5) {
            corner |= Corner.Bottom
        }

        return corner;
    };

    const getResizeCornerCursor = (corner: Corner) => {
        switch (corner) {
            case Corner.TopLeft:
            case Corner.BottomRight:
                return "nwse-resize";

            case Corner.BottomLeft:
            case Corner.TopRight:
                return "nesw-resize";

            case Corner.Left:
            case Corner.Right:
                return "ew-resize";

            case Corner.Top:
            case Corner.Bottom:
                return "ns-resize";

            case Corner.None:
                return "auto";
        }
    };

    const handleResizeDown = (e: React.MouseEvent) => {
        setIsResizing(true);

        if (!movableRef.current) return;
        const currentPosition = movableRef.current.getPosition();

        resizeStartPos.current = {
            x: currentPosition.x,
            y: currentPosition.y,
        }
        resizeStartSize.current = {
            width: currentSize.width,
            height: currentSize.height,
        }
    };

    const handleResizeMove = (e: MouseEvent) => {
        if (!isResizing) return;
        if (!movableRef.current) return;
        const currentPosition = movableRef.current.getPosition();

        const minWidth = 200;
        const minHeight = 100;

        let newSize = currentSize;
        let newPosition = currentPosition;
        if (currentCorner & Corner.Left) {
            const dist = e.clientX - resizeStartPos.current.x;
            newSize.width = Math.max(minWidth, resizeStartSize.current.width - dist);
            newPosition.x = resizeStartPos.current.x + resizeStartSize.current.width - newSize.width;
        } else if (currentCorner & Corner.Right) {
            newSize.width = e.clientX - resizeStartPos.current.x;
        }

        if (currentCorner & Corner.Top) {
            const dist = e.clientY - resizeStartPos.current.y;
            newSize.height = Math.max(minHeight, resizeStartSize.current.height - dist);
            newPosition.y = resizeStartPos.current.y + resizeStartSize.current.height - newSize.height;
        } else if (currentCorner & Corner.Bottom) {
            newSize.height = e.clientY - resizeStartPos.current.y;
        }

        movableRef.current.setPosition({
            x: newPosition.x,
            y: newPosition.y
        });

        setCurrentSize({
            width: Math.max(minWidth, newSize.width),
            height: Math.max(minHeight, newSize.height)
        });
    };
    const handleResizeUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const updateCursor = () => {
            if (!isResizing && !movableRef.current?.getIsDragging()) {
                if (!movableRef.current) return;
                const currentPosition = movableRef.current.getPosition();

                // Calculate mouse position relative to window
                const relativeMousePos = {
                    x: mousePosition.x - currentPosition.x,
                    y: mousePosition.y - currentPosition.y
                };

                // Check if mouse is within resize area (5px border around window)
                const resizeAreaPos = {
                    x: relativeMousePos.x + 5, // Account for the -5px offset of resize element
                    y: relativeMousePos.y + 5
                };

                // Only update cursor if mouse is within the resize area
                if (resizeAreaPos.x >= 0 && resizeAreaPos.x <= currentSize.width + 10
                    && resizeAreaPos.y >= 0 && resizeAreaPos.y <= currentSize.height + 10) {

                    const newCorner = getWindowCorner(relativeMousePos);

                    if (newCorner !== currentCorner) {
                        setCurrentCorner(newCorner);
                    }
                }
            }

            animationFrameRef.current = requestAnimationFrame(updateCursor);
        };

        animationFrameRef.current = requestAnimationFrame(updateCursor);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [movableRef, currentSize, mousePosition, currentCorner, isResizing]);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', handleResizeUp);

            return () => {
                document.removeEventListener('mousemove', handleResizeMove);
                document.removeEventListener('mouseup', handleResizeUp);
            };
        }
    }, [isResizing]);

    return (
        <div>
            <div
                onClick={handleResizeDown}
                style={{
                    transform: `translate(${(movableRef.current?.getPosition().x ?? 0) - 5}px, ${(movableRef.current?.getPosition().y ?? 0) - 5}px)`,
                    width: currentSize.width + 10,
                    height: currentSize.height + 10,
                    position: 'fixed',
                    userSelect: 'none',
                }}>
            </div>
            <Movable 
            {...(props as MovableProps)} 
            ref={movableRef}>
            </Movable>
        </div>
    );
};