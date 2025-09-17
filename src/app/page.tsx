'use client'
import { useState, useRef, useEffect } from 'react';

function useDraggable() {
  const [position, setPosition] = useState({ x: 278, y: 156 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    const iframe = document.getElementById('mygame-iframe');
    if (iframe) {
      iframe.style.pointerEvents = 'none';
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging) return;
    setPosition({
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

  return {
    position,
    isDragging,
    dragProps: {
      onMouseDown: handleMouseDown,
      style: {
        transform: `translate(${position.x}px, ${position.y}px)`
      }
    }
  };
}

export default function Home() {
  const draggable = useDraggable();

  return (
    <div style={{ overflow: 'hidden', height: '100vh', width: '100vw' }}>
      <div 
        {...draggable.dragProps}
        style={{
          ...draggable.dragProps.style,
          position: 'fixed',
          width: 1363,
          height: 768,
          background: '#1F1F23',
          border: '1px solid #464647',
          paddingTop: 34,
          userSelect: 'none',
          borderRadius: 10,
          overflow: 'hidden'
        }}
      >
        <iframe id="mygame-iframe" src="./game.html" style={{width: '100%', height: '100%', margin: 'auto'}}></iframe>
      </div>
      <div id="taskbar" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50px',
        background: '#1F1F23',
        borderTop: '1px solid #464647',
        zIndex: 1000
      }} />
      <img style={{width: '100%', height: '100%'}} src={'./wallpaper.webp'}></img>
    </div>
  );
}
