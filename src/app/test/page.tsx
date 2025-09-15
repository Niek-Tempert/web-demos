'use client'
import { useState, useRef } from 'react';

function useDraggable() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    position,
    isDragging,
    dragProps: {
      onMouseDown: handleMouseDown,
      style: {
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }
    },
    // Attach these to document or a parent container
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp
  };
}

export default function Test() {
  const draggable = useDraggable();

  return (
    <div 
      style={{ height: '100vh', background: '#4a90e2' }}
      onMouseMove={draggable.onMouseMove}
      onMouseUp={draggable.onMouseUp}
    >
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
        Drag me around!
      </div>
    </div>
  );
}