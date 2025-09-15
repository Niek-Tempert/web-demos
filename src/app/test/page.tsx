'use client'
import { useState, useRef, useEffect } from 'react';

function useDraggable() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach global event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return {
    position,
    isDragging,
    dragProps: {
      onMouseDown: handleMouseDown,
      style: {
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }
    }
  };
}

export default function Home() {
  const draggable = useDraggable();

  return (
    <div style={{ height: '100vh', background: '#4a90e2' }}>
      <div 
        {...draggable.dragProps}
        style={{
          ...draggable.dragProps.style,
          position: 'absolute',
          width: 200,
          height: 100,
          background: 'white',
          border: '1px solid #ccc',
          padding: 10,
          userSelect: 'none'
        }}
      >
        Drag me around! (Even fast!)
      </div>
    </div>
  );
}