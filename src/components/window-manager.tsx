"use client"
import React, { createContext, useContext, useState, useCallback } from 'react';

interface WindowContextType {
  bringToFront: (windowId: string) => void;
  getZIndex: (windowId: string) => number;
}

const WindowContext = createContext<WindowContextType | null>(null);

export function WindowManager({ children }: { children: React.ReactNode }) {
  const [windowOrder, setWindowOrder] = useState<string[]>([]);
  const baseZIndex = 1000;

  const bringToFront = useCallback((windowId: string) => {
    setWindowOrder(prev => {
      const filtered = prev.filter(id => id !== windowId);
      return [...filtered, windowId]; // Add to end (highest z-index)
    });
  }, []);

  const getZIndex = useCallback((windowId: string) => {
    const index = windowOrder.indexOf(windowId);
    return index === -1 ? baseZIndex : baseZIndex + index + 1;
  }, [windowOrder, baseZIndex]);

  return (
    <WindowContext.Provider value={{ bringToFront, getZIndex }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowManager must be used within WindowManager');
  }
  return context;
}
