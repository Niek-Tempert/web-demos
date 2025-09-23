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

    handleDragDown = (e: React.MouseEvent | MouseEvent) => {
        this.setState({
            isDragging: true,
            dragStart: {
                x: e.clientX - this.state.position.x,
                y: e.clientY - this.state.position.y,
            },
        });
    };
    handleDragMove = (e: MouseEvent) => {
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
    handleDragUp = (e: MouseEvent) => {
        this.setState({
            isDragging: false,
        });
    };

    componentDidMount(): void {
        if (this.props.dragRef?.current) {
            this.props.dragRef.current.addEventListener('mousedown', this.handleDragDown);
        }
    }

    componentDidUpdate(prevProps: MovableProps, prevState: MovableState) {
        if (prevProps.position !== this.props.position &&
            this.props.position &&
            !this.state.isDragging) {
            this.setState({
                position: this.props.position
            });
        }

        if (prevState.isDragging !== this.state.isDragging) {
            if (this.state.isDragging) {
                document.addEventListener('mousemove', this.handleDragMove);
                document.addEventListener('mouseup', this.handleDragUp);
            } else {
                document.removeEventListener('mousemove', this.handleDragMove);
                document.removeEventListener('mouseup', this.handleDragUp);
            }
        }

        if (prevProps.dragRef !== this.props.dragRef) {
            if (prevProps.dragRef?.current) {
                prevProps.dragRef.current.removeEventListener('mousedown', this.handleDragDown);
            }
            if (this.props.dragRef?.current) {
                this.props.dragRef.current.addEventListener('mousedown', this.handleDragDown);
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleDragMove);
        document.removeEventListener('mouseup', this.handleDragUp);
        if (this.props.dragRef?.current) {
            this.props.dragRef.current.removeEventListener('mousedown', this.handleDragDown);
        }
    }

    render(): React.ReactNode {
        return (
            <div
                onMouseDown={!this.props.dragRef ? this.handleDragDown : undefined}
                style={{
                    transform: `translate(${this.state.position.x}px, ${this.state.position.y}px)`,
                    position: 'fixed',
                    userSelect: 'none',
                    width: this.props.size?.width ?? undefined,
                    height: this.props.size?.height ?? undefined,
                }}>
                {this.props.children}
            </div>
        );
    }
};