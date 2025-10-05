'use client';
import { Size, Vec2 } from "@/Types/Vector";
import { Corner, MovableProps, MovableResizeableProps, MovableResizeableState } from "@/Types/Props";
import React, { createRef, RefObject } from "react";
import Movable from "./movable";

export default class MovableResizeable extends React.Component<MovableResizeableProps, MovableResizeableState> {
    resizeRef: RefObject<HTMLDivElement | null> = createRef();

    state: MovableResizeableState = {
        position: this.props.position || Vec2.Zero,
        size: this.props.size || Size.Zero,
        isResizing: false,
        resizeStartPos: Vec2.Zero,
        resizeStartSize: Size.Zero,
        selectedCorner: Corner.None,
    }

    getWindowCorner = (point: Vec2) => {
        let corner = Corner.None;
        const resize_width = 10;

        if (point.x <= resize_width) {
            corner |= Corner.Left
        } else if (point.x >= this.state.size.width - resize_width) {
            corner |= Corner.Right
        }

        if (point.y <= resize_width) {
            corner |= Corner.Top
        } else if (point.y >= this.state.size.height - resize_width) {
            corner |= Corner.Bottom
        }

        return corner;
    };

    getResizeCornerCursor = (corner: Corner) => {
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

    handleResizeDown = (e: React.PointerEvent) => {
        if (this.props.canResize === false) return;
        this.setState({
            isResizing: true,
            resizeStartPos: this.state.position,
            resizeStartSize: this.state.size,
        });

        this.resizeRef.current?.addEventListener('pointermove', this.handleResizeMove);
        this.resizeRef.current?.setPointerCapture(e.pointerId);

        this.props.onResizeStart?.();
    };

    handleResizeMove = (e: PointerEvent) => {
        if (!this.state.isResizing) return;

        const newSize = structuredClone(this.state.size);
        const newPosition = structuredClone(this.state.position);
        if (this.state.selectedCorner & Corner.Left) {
            const dist = e.clientX - this.state.resizeStartPos.x;
            newSize.width = this.state.resizeStartSize.width - dist;
            if (this.props.minSize?.width) {
                newSize.width = Math.max(this.props.minSize.width, newSize.width);
            }
            newPosition.x = this.state.resizeStartPos.x + this.state.resizeStartSize.width - newSize.width;
        }
        if (this.state.selectedCorner & Corner.Top) {
            const dist = e.clientY - this.state.resizeStartPos.y;
            newSize.height = this.state.resizeStartSize.height - dist;
            if (this.props.minSize?.height) {
                newSize.height = Math.max(this.props.minSize.height, newSize.height);
            }
            newPosition.y = this.state.resizeStartPos.y + this.state.resizeStartSize.height - newSize.height;
        }

        if (this.state.selectedCorner & Corner.Right) {
            newSize.width = e.clientX - this.state.resizeStartPos.x;
            if (this.props.minSize?.width) {
                newSize.width = Math.max(this.props.minSize.width, newSize.width);
            }
        }
        if (this.state.selectedCorner & Corner.Bottom) {
            newSize.height = e.clientY - this.state.resizeStartPos.y;
            if (this.props.minSize?.height) {
                newSize.height = Math.max(this.props.minSize.height, newSize.height);
            }
        }

        this.setState({
            position: newPosition,
            size: newSize,
        });

        this.props.onMove?.(newPosition);
        this.props.onResize?.(newSize);
    };
    handleResizeUp = (e: React.PointerEvent) => {
        this.setState({
            isResizing: false,
        });

        this.resizeRef.current?.removeEventListener('pointermove', this.handleResizeMove);
        this.resizeRef.current?.releasePointerCapture(e.pointerId);

        this.props.onResizeEnd?.();
    };
    handleMouseMove = (e: React.MouseEvent) => {
        if (this.state.isResizing) return;
        const relativeMousePos = {
            x: e.clientX - this.state.position.x,
            y: e.clientY - this.state.position.y
        };

        const newCorner = this.getWindowCorner(relativeMousePos);

        if (newCorner !== this.state.selectedCorner) {
            this.setState({
                selectedCorner: newCorner,
            });
        }
    }

    componentDidUpdate(prevProps: MovableResizeableProps, prevState: MovableResizeableState) {
        if (this.props.position
            && (!prevProps.position
                || !Vec2.Equals(prevProps.position, this.props.position))) {
            this.setState({
                position: this.props.position
            });
        }

        if (this.props.size
            && (!prevProps.size
                || !Size.Equals(prevProps.size, this.props.size))) {
            this.setState({
                size: this.props.size
            });
        }
    }

    onMove = (position: Vec2) => {
        this.setState({
            position: position,
        })
        this.props.onMove?.(position);
    }

    render(): React.ReactNode {
        return (
            <div>
                <div
                    ref={this.resizeRef}
                    onPointerDown={this.handleResizeDown}
                    onPointerUp={this.handleResizeUp}
                    onMouseMove={this.handleMouseMove}
                    style={{
                        transform: `translate(${(this.state.position.x) - 5}px, ${(this.state.position.y) - 5}px)`,
                        width: this.state.size.width + 10,
                        height: this.state.size.height + 10,
                        position: 'fixed',
                        userSelect: 'none',
                        cursor: this.getResizeCornerCursor(this.state.selectedCorner),
                    }}>
                </div>
                <Movable
                    {...(this.props as MovableProps)}
                    position={this.state.position}
                    onMove={this.onMove}>
                    <div
                        style={{
                            width: this.state.size.width,
                            height: this.state.size.height,
                        }}>
                        {this.props.children}
                    </div>
                </Movable>
            </div>
        );

    }
};