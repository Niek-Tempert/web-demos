'use client';
import { MovableProps, MovableState } from "@/Types/Props";
import { Vec2 } from "@/Types/Vector";
import React from "react";

export default class Movable extends React.Component<MovableProps, MovableState> {
    state: MovableState = {
        position: this.props.position || Vec2.Zero,
        isDragging: false,
        dragStart: Vec2.Zero,
    };

    handleDragDown = (e: React.PointerEvent | PointerEvent) => {
        if (this.props.canDrag === false) return;
        this.setState({
            isDragging: true,
            dragStart: {
                x: e.clientX - this.state.position.x,
                y: e.clientY - this.state.position.y,
            },
        });

        const iframes = document.getElementsByTagName("iframe")
        for (const iframe of iframes) {
            iframe.style.pointerEvents = 'none';
        }
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
    handleDragUp = () => {
        this.setState({
            isDragging: false,
        });

        const iframes = document.getElementsByTagName("iframe")
        for (const iframe of iframes) {
            iframe.style.pointerEvents = 'auto';
        }
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
                onPointerDown={!this.props.dragRef ? this.handleDragDown : undefined}
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