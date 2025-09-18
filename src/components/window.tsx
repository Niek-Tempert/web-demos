'use client'
import { useState, useRef, useEffect } from 'react';

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
  size = { width: 1400, height: 800 } 
}: WindowProps) {
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y
    };

    const iframe = document.getElementById('mygame-iframe');
    if (iframe) {
      iframe.style.pointerEvents = 'none';
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setCurrentPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    const iframe = document.getElementById('mygame-iframe');
    if (iframe) {
      iframe.style.pointerEvents = 'auto';
    }
  };

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

  return (
    <div style={{
        transform: `translate(${currentPosition.x}px, ${currentPosition.y}px)`,
        background: 'orange', 
        position: 'fixed', 
        padding: 2,
        cursor: 'crosshair'
      }}>
      <div 
        onMouseDown={handleMouseDown}
        style={{
          width: size.width,
          height: size.height,
          background: '#1F1F23',
          border: '1px solid #464647',
          userSelect: 'none',
          borderRadius: 10,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'auto'
        }}>
        <div
          style={{
            width: '100%', 
            height: 34, 
            display: 'flex',
            flexShrink: 0
            }}>
            <p style={{padding: 4}}>{title}</p>
            <div className="grid flex-grow"></div>
            <div style={{width: 34, height: '100%', background: 'blue'}}></div>
            <div style={{width: 34, height: '100%', background: 'green'}}></div>
            <div style={{width: 34, height: '100%', background: 'red'}}></div>
          </div>
          <div style={{
            flex: 1,
            overflow: 'auto',
            background: 'black'
          }}>
            {children}
          </div>
      </div>
    </div>
  );
}