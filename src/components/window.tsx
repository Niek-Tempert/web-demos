'use client'
import { useWindowManager } from '@/components/window-manager';
import { Size, Vec2 } from '@/Types/Vector';
import { useId, useRef } from 'react';
import WindowTitleBar from './window-title-bar';
import MovableResizeable from './movable-resizeable';

interface WindowProps {
  children?: React.ReactNode;
  title?: string;
  position?: Vec2;
  size?: Size;
}

export default function Window({
  children,
  title = "Window",
  position = { x: 100, y: 100 },
  size = { width: 1000, height: 600 }
}: WindowProps) {
  const windowId = useId();
  const { bringToFront, getZIndex } = useWindowManager();

  const titleBarRef = useRef<HTMLDivElement>(null);

  const handleWindowClick = () => {
    bringToFront(windowId);
  };

  return (
    <div
      onMouseDown={handleWindowClick}
      style={{
        zIndex: getZIndex(windowId),
        position: 'fixed',
      }}>
      <MovableResizeable
        position={position}
        size={size}
        minSize={{ width: 200, height: 100 }}
        dragRef={titleBarRef}>
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
          <WindowTitleBar
            ref={titleBarRef}
            title={title} />
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
    </div>
  );
}