"use client"
import React, { createContext, useContext, useState, useCallback, useId } from 'react';

interface WindowContextType {
  startWindow: (data: { children: React.ReactNode }) => number;
  focusWindow: (index: number) => void;
  bringToFront: (windowId: string) => void;
  getZIndex: (windowId: string) => number;
}

const WindowContext = createContext<WindowContextType | null>(null);

export function WindowManager({ children }: { children?: React.ReactNode }) {
  const [windows, setWindows] = useState<React.ReactNode[]>([]);
  const [windowOrder, setWindowOrder] = useState<string[]>([]);
  const baseZIndex = 1000;

  const startWindow = useCallback(({ children }: { children: React.ReactNode }) => {
    setWindows(prev => {
      return [...prev, children];
    });

    return windows.length; // TODO: Fix
  }, [windows, setWindows]);

  const focusWindow = useCallback((index: number) => {
    // windows[index];
  }, []);

  const bringToFront = useCallback((windowId: string) => {
    setWindowOrder(prev => {
      const filtered = prev.filter(id => id !== windowId);
      return [...filtered, windowId];
    });
  }, []);

  const getZIndex = useCallback((windowId: string) => {
    const index = windowOrder.indexOf(windowId);
    return index === -1 ? baseZIndex : baseZIndex + index + 1;
  }, [windowOrder, baseZIndex]);

  return (
    <WindowContext.Provider value={{ startWindow, focusWindow, bringToFront, getZIndex }}>
      {windows.map((window, index) => {
        return (
          <div key={index}>
            {window}
          </div>
        );
      })}
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
