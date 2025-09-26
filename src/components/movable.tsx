'use client';
import { MovableProps, MovableState } from "@/Types/Props";
import { Vec2 } from "@/Types/Vector";
import React, { createRef, RefObject } from "react";

export default class Movable extends React.Component<MovableProps, MovableState> {
    captureElement: RefObject<HTMLDivElement | null> = createRef();

    state: MovableState = {
        position: this.props.position || Vec2.Zero,
        isDragging: false,
        dragStart: Vec2.Zero,
    };

    handleDragDownReact = (e: React.PointerEvent) => {
        this.handleDragDown(e.nativeEvent);
    }

    handleDragDown = (e: PointerEvent) => {
        if (this.props.canDrag === false) return;
        this.setState({
            isDragging: true,
            dragStart: {
                x: e.clientX - this.state.position.x,
                y: e.clientY - this.state.position.y,
            },
        });

        const refElem = this.props.dragRef ?? this.captureElement;
        refElem.current?.setPointerCapture(e.pointerId);

        this.props.onMoveStart?.(e);
    };
    handleDragMove = (e: PointerEvent) => {
        if (!this.state.isDragging) return;

        const newPosition = {
            x: e.clientX - this.state.dragStart.x,
            y: e.clientY - this.state.dragStart.y,
        };
        this.setState({
            position: newPosition,
        });

        this.props.onMove?.(e, newPosition);
    };
    handleDragUp = (e: PointerEvent) => {
        this.setState({
            isDragging: false,
        });

        const refElem = this.props.dragRef ?? this.captureElement;
        refElem.current?.releasePointerCapture(e.pointerId);

        this.props.onMoveEnd?.(e);
    };

    componentDidMount(): void {
        if (this.props.dragRef?.current) {
            this.props.dragRef.current.addEventListener('pointerdown', this.handleDragDown);
        }
    }

    componentDidUpdate(prevProps: MovableProps, prevState: MovableState) {
        if (this.props.position
            && (prevProps.position?.x !== this.props.position.x
                || prevProps.position?.y !== this.props.position.y)
            && !this.state.isDragging) {
            this.setState({
                position: this.props.position
            });
        }

        if (prevState.isDragging !== this.state.isDragging) {
            if (this.state.isDragging) {
                document.addEventListener('pointermove', this.handleDragMove);
                document.addEventListener('pointerup', this.handleDragUp);
            } else {
                document.removeEventListener('pointermove', this.handleDragMove);
                document.removeEventListener('pointerup', this.handleDragUp);
            }
        }

        if (prevProps.dragRef !== this.props.dragRef) {
            if (prevProps.dragRef?.current) {
                prevProps.dragRef.current.removeEventListener('pointerdown', this.handleDragDown);
            }
            if (this.props.dragRef?.current) {
                this.props.dragRef.current.addEventListener('pointerdown', this.handleDragDown);
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('pointermove', this.handleDragMove);
        document.removeEventListener('pointerup', this.handleDragUp);
        if (this.props.dragRef?.current) {
            this.props.dragRef.current.removeEventListener('pointerdown', this.handleDragDown);
        }
    }

    render(): React.ReactNode {
        return (
            <div
                ref={this.captureElement}
                onPointerDown={!this.props.dragRef ? this.handleDragDownReact : undefined}
                style={{
                    transform: `translate(${this.state.position.x}px, ${this.state.position.y}px)`,
                    position: 'fixed',
                    userSelect: 'none',
                }}>
                {this.props.children}
            </div>
        );
    }
};