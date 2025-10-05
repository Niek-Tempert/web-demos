'use client'
import { useWindowManager } from '@/components/os/window/window-manager';
import { Size, Vec2 } from '@/Types/Vector';
import { useCallback, useRef, useState } from 'react';
import WindowTitleBar from './window-title-bar';
import MovableResizeable from '../../movable/movable-resizeable';
import { useIsMobile } from '@/hooks/use-mobile';

interface WindowProps {
  children?: React.ReactNode;
  id: number;
  title?: string;
  position?: Vec2;
  size?: Size;
  maximized?: boolean;
}

export default function Window({
  children,
  id,
  title = "Window",
  position = { x: 100, y: 100 },
  size = { width: 1000, height: 600 },
  maximized = false
}: WindowProps) {
  const windowID = useRef(id);
  const { bringToFront, minimize, getZIndex, getIsVisible } = useWindowManager();
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentSize, setCurrentSize] = useState(size);
  const [isMaximized, setIsMaximized] = useState(maximized);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleWindowClick = useCallback(() => {
    bringToFront(windowID.current);
  }, [bringToFront]);

  const onMove = useCallback((position: Vec2) => {
    if (isMaximized) {
      setIsMaximized(false);
    };
    setCurrentPosition(position);
  }, [isMaximized]);

  const onResize = useCallback((size: Size) => {
    setCurrentSize(size);
  }, []);

  const onMaximize = useCallback(() => {
    setIsMaximized(!isMaximized);
  }, [isMaximized]);

  const onMinimize = useCallback(() => {
    minimize(windowID.current);
  }, [minimize]);

  const suspendIframe = useCallback(() => {
    const iframes = document.getElementsByTagName("iframe")
    for (const iframe of iframes) {
      iframe.style.pointerEvents = 'none';
    }
  }, []);

  const resumeIframe = useCallback(() => {
    const iframes = document.getElementsByTagName("iframe")
    for (const iframe of iframes) {
      iframe.style.pointerEvents = 'auto';
    }
  }, []);

  return (
    <div
      onMouseDown={handleWindowClick}
      style={{
        zIndex: getZIndex(windowID.current),
        position: 'fixed',
        visibility: !getIsVisible(windowID.current) ? 'hidden' : undefined,
      }}>
      <MovableResizeable
        canDrag={!(isMobile && isMaximized)}
        canResize={!isMaximized}
        onMove={onMove}
        onResize={onResize}
        onMoveStart={suspendIframe}
        onResizeStart={suspendIframe}
        onMoveEnd={resumeIframe}
        onResizeEnd={resumeIframe}
        position={!isMaximized ? currentPosition : Vec2.Zero}
        size={!isMaximized ? currentSize : { width: innerWidth, height: innerHeight }}
        minSize={{ width: 200, height: 100 }}
        dragRef={titleBarRef}>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#1F1F23',
            border: !isMaximized ? '1px solid #464647' : undefined,
            borderRadius: !isMaximized ? 10 : 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <WindowTitleBar
            onMinimize={onMinimize}
            onMaximize={onMaximize}
            onClose={onMinimize}
            ref={titleBarRef}
            title={title}
            isMaximized={isMaximized} />
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