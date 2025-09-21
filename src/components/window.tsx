'use client'
import { useWindowManager } from '@/components/window-manager';
import { useId, useRef } from 'react';
import WindowTitleBar from './window-title-bar';
import Movable from './movable';
import MovableResizeable from './movable-resizeable';

interface WindowProps {
  children?: React.ReactNode;
  title?: string;
  position?: Vec2;
  size?: { width: number | string, height: number | string };
}

export default function Window({
  children,
  title = "Window",
  position = { x: 100, y: 100 },
  size = { width: 1400, height: 800 }
}: WindowProps) {
  const windowId = useId();
  const { bringToFront, getZIndex } = useWindowManager();

  const titleBarRef = useRef<HTMLDivElement>(null);

  const handleWindowClick = () => {
    bringToFront(windowId);
  };

  return (
    <MovableResizeable position={position} dragRef={titleBarRef}>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#1F1F23',
          border: '1px solid #464647',
          borderRadius: 10,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <WindowTitleBar ref={titleBarRef} title={title} />
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            background: 'black',
          }}>
          {children}
        </div>
      </div>
    </MovableResizeable>
  );
}