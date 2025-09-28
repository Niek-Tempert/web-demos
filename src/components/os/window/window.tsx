'use client'
import { useWindowManager } from '@/components/os/window/window-manager';
import { Size, Vec2 } from '@/Types/Vector';
import { useId, useRef, useState } from 'react';
import WindowTitleBar from './window-title-bar';
import MovableResizeable from '../../movable/movable-resizeable';
import { ExternalCallback, useExternal } from '@/Types/Hooks';

interface WindowProps {
  children?: React.ReactNode;
  title?: string;
  position?: Vec2;
  size?: Size;
  visibilityCallback?: ExternalCallback<boolean>;
}

export default function Window({
  children,
  title = "Window",
  position = { x: 100, y: 100 },
  size = { width: 1000, height: 600 },
  visibilityCallback = [true, () => { }]
}: WindowProps) {
  const windowId = useId();
  const { bringToFront, getZIndex } = useWindowManager();
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentSize, setCurrentSize] = useState(size);
  const [isMaximized, setIsMaximized] = useState(false);

  const [isVisible, setIsVisible] = useExternal(visibilityCallback);

  const titleBarRef = useRef<HTMLDivElement>(null);

  const handleWindowClick = () => {
    bringToFront(windowId);
  };

  const onMove = (e: MouseEvent, position: Vec2) => {
    if (isMaximized) return;
    setCurrentPosition(position);
  }

  const onResize = (e: PointerEvent, size: Size) => {
    if (isMaximized) return;
    setCurrentSize(size);
  }

  const onMaximize = (e: React.MouseEvent) => {
    setIsMaximized(!isMaximized);
    e.preventDefault();
    e.stopPropagation();
  };

  const onHide = (e: React.MouseEvent) => {
    setIsVisible(false);
    e.preventDefault();
    e.stopPropagation();
  };

  const suspendIframe = () => {
    const iframes = document.getElementsByTagName("iframe")
    for (const iframe of iframes) {
      iframe.style.pointerEvents = 'none';
    }
  }

  const resumeIframe = () => {
    const iframes = document.getElementsByTagName("iframe")
    for (const iframe of iframes) {
      iframe.style.pointerEvents = 'auto';
    }
  }

  return (
    <div
      onMouseDown={handleWindowClick}
      style={{
        zIndex: getZIndex(windowId),
        position: 'fixed',
        visibility: !isVisible ? 'hidden' : undefined,
      }}>
      <MovableResizeable
        canDrag={!isMaximized}
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
            border: '1px solid #464647',
            borderRadius: !isMaximized ? 10 : 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <WindowTitleBar
            onMinimize={onHide}
            onMaximize={onMaximize}
            onClose={onHide}
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