'use client'
import { useWindowManager } from '@/managers/windowmanager';
import { useState, useRef, useEffect, useId } from 'react';

function suspendIframe() {
  const iframe = document.getElementById('mygame-iframe');
  if (iframe) {
    iframe.style.pointerEvents = 'none';
  }
}

function resumeIframe() {
  const iframe = document.getElementById('mygame-iframe');
  if (iframe) {
    iframe.style.pointerEvents = 'auto';
  }
}

interface WindowProps {
  children?: React.ReactNode;
  title?: string;
  position?: Vec2;
  size?: Size;
}

enum Corner {
  None,
  Left,
  Right,
  Top,
  Bottom,
  TopLeft,
  BottomLeft,
  TopRight,
  BottomRight
}

export default function Window({
  children,
  title = "Window",
  position = { x: 100, y: 100 },
  size = { width: 1400, height: 800 }
}: WindowProps) {
  const windowId = useId(); // Generate unique ID for this window
  const { bringToFront, getZIndex } = useWindowManager();

  const [windowPosition, setWindowPosition] = useState(position);
  const [windowSize, setWindowSize] = useState(size);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0 });

  const getWindowCorner = () => {
    // Find corner
  };

  const handleWindowClick = () => {
    bringToFront(windowId);
  };

  const handleDragDown = (e: React.MouseEvent) => {
    handleWindowClick();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y
    };

    suspendIframe();
  };
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setWindowPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };
  const handleDragUp = () => {
    setIsDragging(false);

    resumeIframe();
  };

  const handleResizeDown = (e: React.MouseEvent) => {
    handleWindowClick();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y
    };

    suspendIframe();
  };
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;

    // Calculate new size based on mouse position relative to window position
    const newWidth = e.clientX - windowPosition.x;
    const newHeight = e.clientY - windowPosition.y;

    // Set minimum and maximum constraints
    const minWidth = 200;
    const minHeight = 100;
    const maxWidth = window.innerWidth - windowPosition.x;
    const maxHeight = window.innerHeight - windowPosition.y;

    setWindowSize({
      width: Math.max(minWidth, Math.min(maxWidth, newWidth)),
      height: Math.max(minHeight, Math.min(maxHeight, newHeight))
    });
  };
  const handleResizeUp = () => {
    setIsResizing(false);

    resumeIframe();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragUp);

      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragUp);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeUp);

      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeUp);
      };
    }
  }, [isResizing]);

  return (
    <div>
      <div // Resize element
        onMouseDown={handleResizeDown}
        style={{
          transform: `translate(${windowPosition.x - 5}px, ${windowPosition.y - 5}px)`,
          width: windowSize.width + 10,
          height: windowSize.height + 10,
          position: 'fixed',
          userSelect: 'none',
          zIndex: getZIndex(windowId),
          cursor: 'crosshair',
        }}>
      </div>
      <div // Draggable element
        onMouseDown={handleDragDown}
        style={{
          transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`,
          width: windowSize.width,
          height: windowSize.height,
          position: 'fixed',
          userSelect: 'none',
          zIndex: getZIndex(windowId),

          background: '#1F1F23',
          border: '1px solid #464647',
          borderRadius: 10,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <div
          style={{
            width: '100%',
            height: 34,
            display: 'flex',
            flexShrink: 0,
          }}>
          <p style={{ padding: 4 }}>{title}</p>
          <div className="grid flex-grow"></div>
          <button style={{ width: 34, height: '100%', background: 'blue' }}></button>
          <button style={{ width: 34, height: '100%', background: 'green' }}></button>
          <button style={{ width: 34, height: '100%', background: 'red' }}></button>
        </div>
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            background: 'black',
          }}>
          {children}
        </div>
      </div>
    </div>
  );
}