'use client';
import { forwardRef, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface MovableProps {
    children?: React.ReactNode;
    position?: Vec2;
    dragRef?: RefObject<HTMLDivElement | null>;
    onMove?: (params: { e: MouseEvent, position: Vec2 }) => void;
}

export interface MovableRef {
    getPosition: () => Vec2;
    setPosition: (position: Vec2) => void;
    getIsDragging: () => boolean;
    setIsDragging: (value: boolean) => void;
}

const Movable = forwardRef<MovableRef, MovableProps>(({
    children,
    position = { x: 0, y: 0 },
    dragRef,
    onMove,
}: MovableProps, ref: any) => {
    const [currentPosition, setCurrentPosition] = useState(position);
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    useImperativeHandle(ref, () => ({
        getPosition: () => currentPosition,
        setPosition: (newPosition: Vec2) => {
            setCurrentPosition(newPosition);
        },
        getIsDragging: () => isDragging,
        setIsDragging: (value: boolean) => {
            setIsDragging(value);
        },
    }), [currentPosition]);


    const handleDragDown = (e: React.MouseEvent | MouseEvent) => {
        setIsDragging(true);

        dragStart.current = {
            x: e.clientX - currentPosition.x,
            y: e.clientY - currentPosition.y,
        };
    };
    const handleDragMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const newPosition = {
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y,
        };

        setCurrentPosition({
            x: newPosition.x,
            y: newPosition.y,
        });

        onMove?.({ e, position: newPosition });
    };
    const handleDragUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragUp);

            return () => {
                document.removeEventListener('mousemove', handleDragMove);
                document.removeEventListener('mouseup', handleDragUp);
            };
        }
    }, [isDragging]);

    useEffect(() => {
        const element = dragRef?.current;
        if (element) {
            element.addEventListener('mousedown', handleDragDown);

            return () => {
                element.removeEventListener('mousedown', handleDragDown);
            };
        }
    }, [dragRef, handleDragDown]);

    return (
        <div
            onMouseDown={
                !dragRef
                    ? handleDragDown
                    : undefined
            }
            style={{
                transform: `translate(${currentPosition.x}px, ${currentPosition.y}px)`,
                position: 'fixed',
                userSelect: 'none',
            }}>
            {children}
        </div>
    );
});

Movable.displayName = 'Movable';

export default Movable;