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

    handleDragDownReact = (e: React.MouseEvent) => {
        this.handleDragDown(e.nativeEvent);
    }

    handleTouchStartReact = (e: React.TouchEvent) => {
        this.handleTouchStart(e.nativeEvent);
    }

    handleTouchStart = (e: TouchEvent) => {
        if (this.props.canDrag === false) return;
        if (!e.changedTouches.length) return;

        const touch = e.touches[0];

        this.setState({
            isDragging: true,
            dragStart: {
                x: touch.clientX - this.state.position.x,
                y: touch.clientY - this.state.position.y,
            },
        });

        this.props.onMoveStart?.();
    }
    handleTouchMove = (e: TouchEvent) => {
        if (!this.state.isDragging) return;

        const touch = e.touches[0];

        const newPosition = {
            x: touch.clientX - this.state.dragStart.x,
            y: touch.clientY - this.state.dragStart.y,
        };
        this.setState({
            position: newPosition,
        });

        this.props.onMove?.(newPosition);
    }
    handleTouchEnd = () => {
        this.setState({
            isDragging: false,
        });

        this.props.onMoveEnd?.();
    };

    handleDragDown = (e: MouseEvent) => {
        if (this.props.canDrag === false) return;
        this.setState({
            isDragging: true,
            dragStart: {
                x: e.clientX - this.state.position.x,
                y: e.clientY - this.state.position.y,
            },
        });

        this.props.onMoveStart?.();
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

        this.props.onMove?.(newPosition);
    };
    handleDragUp = () => {
        this.setState({
            isDragging: false,
        });

        this.props.onMoveEnd?.();
    };

    componentDidMount(): void {
        if (this.props.dragRef?.current) {
            this.props.dragRef.current.addEventListener('mousedown', this.handleDragDown);
            this.props.dragRef.current.addEventListener('touchstart', this.handleTouchStart);
        }
    }

    componentDidUpdate(prevProps: MovableProps, prevState: MovableState) {
        if (this.props.position
            && (!prevProps.position
                || !Vec2.Equals(prevProps.position, this.props.position))) {
            this.setState({
                position: this.props.position
            });
        }

        if (prevState.isDragging !== this.state.isDragging) {
            if (this.state.isDragging) {
                document.addEventListener('mousemove', this.handleDragMove);
                document.addEventListener('mouseup', this.handleDragUp);
                document.addEventListener('touchmove', this.handleTouchMove);
                document.addEventListener('touchend', this.handleTouchEnd);
            } else {
                document.removeEventListener('mousemove', this.handleDragMove);
                document.removeEventListener('mouseup', this.handleDragUp);
                document.removeEventListener('touchmove', this.handleTouchMove);
                document.removeEventListener('touchend', this.handleTouchEnd);
            }
        }

        if (prevProps.dragRef !== this.props.dragRef) {
            if (prevProps.dragRef?.current) {
                prevProps.dragRef.current.removeEventListener('mousedown', this.handleDragDown);
                prevProps.dragRef.current.removeEventListener('touchstart', this.handleTouchStart);
            }
            if (this.props.dragRef?.current) {
                this.props.dragRef.current.addEventListener('mousedown', this.handleDragDown);
                this.props.dragRef.current.removeEventListener('touchstart', this.handleTouchStart);
            }
        }
    }

    componentWillUnmount() {
        if (this.props.dragRef?.current) {
            this.props.dragRef.current.removeEventListener('mousedown', this.handleDragDown);
            this.props.dragRef.current.removeEventListener('touchstart', this.handleTouchStart);
        }
    }

    render(): React.ReactNode {
        return (
            <div
                onMouseDown={!this.props.dragRef?.current ? this.handleDragDownReact : undefined}
                onTouchStart={!this.props.dragRef?.current ? this.handleTouchStartReact : undefined}
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