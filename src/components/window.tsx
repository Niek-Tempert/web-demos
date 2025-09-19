'use client'
import { useWindowManager } from '@/managers/windowmanager';
import { Copy, Minus, X } from 'lucide-react';
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
  size?: { width: any, height: any};
}

enum Corner {
  None = 0,
  Left = 1 << 0,
  Right = 1 << 1,
  Top = 1 << 2,
  Bottom = 1 << 3,
  TopLeft = Top | Left,
  BottomLeft = Bottom | Left,
  TopRight = Top | Right,
  BottomRight = Bottom | Right,
}

export default function Window({
  children,
  title = "Window",
  position = { x: 100, y: 100 },
  size = { width: 1400, height: 800 }
}: WindowProps) {
  const windowId = useId(); // Generate unique ID for this window
  const { bringToFront, getZIndex } = useWindowManager();

  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentSize, setCurrentSize] = useState(size);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const resizeStartSize = useRef({ width: 0, height: 0 });

  const [currentCorner, setCurrentCorner] = useState(Corner.None);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Track mouse position
  const animationFrameRef = useRef<number>(0);

  const getWindowCorner = (point: Vec2) => {
    let corner = Corner.None;

    if (point.x <= 5) {
      corner |= Corner.Left
    } else if (point.x >= currentSize.width - 5) {
      corner |= Corner.Right
    }

    if (point.y <= 5) {
      corner |= Corner.Top
    } else if (point.y >= currentSize.height - 5) {
      corner |= Corner.Bottom
    }

    return corner;
  };

  const getResizeCornerCursor = (corner: Corner) => {
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

  const handleWindowClick = () => {
    bringToFront(windowId);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDragDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    };

    suspendIframe();
  };
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setCurrentPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };
  const handleDragUp = () => {
    setIsDragging(false);

    resumeIframe();
  };

  const handleResizeDown = (e: React.MouseEvent) => {
    handleWindowClick();
    setIsResizing(true);
    resizeStartPos.current = {
      x: currentPosition.x,
      y: currentPosition.y,
    }
    resizeStartSize.current = {
      width: currentSize.width,
      height: currentSize.height,
    }

    suspendIframe();
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const minWidth = 200;
    const minHeight = 100;

    let newSize = currentSize;
    let newPosition = currentPosition;
    if (currentCorner & Corner.Left) {
      const dist = e.clientX - resizeStartPos.current.x;
      newSize.width = Math.max(minWidth, resizeStartSize.current.width - dist);
      newPosition.x = resizeStartPos.current.x + resizeStartSize.current.width - newSize.width;
    } else if (currentCorner & Corner.Right) {
      newSize.width = e.clientX - resizeStartPos.current.x;
    }

    if (currentCorner & Corner.Top) {
      const dist = e.clientY - resizeStartPos.current.y;
      newSize.height = Math.max(minHeight, resizeStartSize.current.height - dist);
      newPosition.y = resizeStartPos.current.y + resizeStartSize.current.height - newSize.height;
    } else if (currentCorner & Corner.Bottom) {
      newSize.height = e.clientY - resizeStartPos.current.y;
    }

    setCurrentPosition({
      x: newPosition.x,
      y: newPosition.y
    });

    setCurrentSize({
      width: Math.max(minWidth, newSize.width),
      height: Math.max(minHeight, newSize.height)
    });
  };
  const handleResizeUp = () => {
    setIsResizing(false);

    resumeIframe();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const updateCursor = () => {
      if (!isResizing && !isDragging) {
        // Calculate mouse position relative to window
        const relativeMousePos = {
          x: mousePosition.x - currentPosition.x,
          y: mousePosition.y - currentPosition.y
        };

        // Check if mouse is within resize area (5px border around window)
        const resizeAreaPos = {
          x: relativeMousePos.x + 5, // Account for the -5px offset of resize element
          y: relativeMousePos.y + 5
        };

        // Only update cursor if mouse is within the resize area
        if (resizeAreaPos.x >= 0 && resizeAreaPos.x <= currentSize.width + 10 &&
          resizeAreaPos.y >= 0 && resizeAreaPos.y <= currentSize.height + 10) {

          const newCorner = getWindowCorner(relativeMousePos);

          if (newCorner !== currentCorner) {
            setCurrentCorner(newCorner);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateCursor);
    };

    animationFrameRef.current = requestAnimationFrame(updateCursor);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentPosition, currentSize, mousePosition, currentCorner, isResizing, isDragging]);

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
      <div
        onMouseDown={handleResizeDown}
        style={{
          transform: `translate(${currentPosition.x - 5}px, ${currentPosition.y - 5}px)`,
          width: currentSize.width + 10,
          height: currentSize.height + 10,
          position: 'fixed',
          userSelect: 'none',
          zIndex: getZIndex(windowId),
          cursor: getResizeCornerCursor(currentCorner),
        }}>
      </div>
      <div
        onMouseDown={handleWindowClick}
        style={{
          transform: `translate(${currentPosition.x}px, ${currentPosition.y}px)`,
          width: currentSize.width,
          height: currentSize.height,
          position: 'fixed',
          userSelect: 'none',
          zIndex: getZIndex(windowId),
        }}>
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
          <div
            onMouseDown={handleDragDown}
            style={{
              width: '100%',
              height: 34,
              display: 'flex',
              flexShrink: 0,
            }}>
            <p 
            style={{ 
              padding: 4, 
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 10,
              }}>
              {title}
            </p>
            <div className="grid flex-grow"></div>
            <div
              onMouseDown={handleMouseDown}
              className='window-btn'
              style={{
                width: 34,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Minus style={{ scale: 0.6 }} />
            </div>
            <div
              onMouseDown={handleMouseDown}
              className='window-btn'
              style={{
                width: 34,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Copy style={{ scale: 0.5, transform: 'rotate(90deg)' }} />
            </div>
            <div
              onMouseDown={handleMouseDown}
              className='window-close-btn'
              style={{
                width: 34,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}><X style={{ scale: 0.6 }} /></div>
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
    </div>
  );
}