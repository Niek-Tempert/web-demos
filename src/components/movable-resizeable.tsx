'use client';
import { Size, Vec2 } from "@/Types/Vector";
import { Corner, MovableProps, MovableResizeableProps, MovableResizeableState } from "@/Types/Props";
import React, { useRef } from "react";
import Movable from "./movable";

export default class MovableResizeable extends React.Component<MovableResizeableProps, MovableResizeableState> {
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

        if (point.x <= 5) {
            corner |= Corner.Left
        } else if (point.x >= this.state.size.width - 5) {
            corner |= Corner.Right
        }

        if (point.y <= 5) {
            corner |= Corner.Top
        } else if (point.y >= this.state.size.height - 5) {
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

        const target = (e.target as Element);
        target.setPointerCapture(e.pointerId);

        const iframes = document.getElementsByTagName("iframe")
        for (const iframe of iframes) {
            iframe.style.pointerEvents = 'none';
        }
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

        this.props.onMove?.(e, newPosition);
        this.props.onResize?.(e, newSize);
    };
    handleResizeUp = (e: PointerEvent) => {
        this.setState({
            isResizing: false,
        });

        const target = (e.target as Element);
        target.releasePointerCapture(e.pointerId);

        const iframes = document.getElementsByTagName("iframe")
        for (const iframe of iframes) {
            iframe.style.pointerEvents = 'auto';
        }
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
            && (prevProps.position?.x !== this.props.position.x
                || prevProps.position?.y !== this.props.position.y)
            && !this.state.isResizing) {
            this.setState({
                position: this.props.position
            });
        }

        if (this.props.size
            && (prevProps.size?.width !== this.props.size.width
                || prevProps.size?.height !== this.props.size.height)
            && !this.state.isResizing) {
            // debugger;
            this.setState({
                size: this.props.size
            });
        }

        if (prevState.isResizing !== this.state.isResizing) {
            if (this.state.isResizing) {
                document.addEventListener('pointermove', this.handleResizeMove);
                document.addEventListener('pointerup', this.handleResizeUp);
            } else {
                document.removeEventListener('pointermove', this.handleResizeMove);
                document.removeEventListener('pointerup', this.handleResizeUp);
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('pointermove', this.handleResizeMove);
        document.removeEventListener('pointerup', this.handleResizeUp);
    }

    onMove = (e: MouseEvent, position: Vec2) => {
        this.setState({
            position: position,
        })
    }

    render(): React.ReactNode {
        return (
            <div>
                <div
                    onPointerDown={this.handleResizeDown}
                    onPointerMove={this.handleMouseMove}
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