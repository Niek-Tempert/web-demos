"use client"
import React, { createContext, useContext, useState, useCallback, useId } from 'react';
import Window from './window';

interface WindowInitProps {
  title?: string;
  children: React.ReactNode
}

interface WindowContextType {
  startWindow: (data: { children: React.ReactNode }) => number;
  bringToFront: (windowID: number) => void;
  getZIndex: (windowID: number) => number;
}

const WindowContext = createContext<WindowContextType | null>(null);

export function WindowManager({ children }: { children?: React.ReactNode }) {
  const [windows, setWindows] = useState<React.ReactNode[]>([]);
  const [windowOrder, setWindowOrder] = useState<number[]>([]);
  const baseZIndex = 1000;

  const bringToFront = useCallback((windowID: number) => {
    setWindowOrder(prev => {
      const filtered = prev.filter(id => id !== windowID);
      return [...filtered, windowID];
    });
  }, []);

  const getZIndex = useCallback((windowID: number) => {
    const index = windowOrder.indexOf(windowID);
    return index === -1 ? baseZIndex : baseZIndex + index + 1;
  }, [windowOrder]);

  const startWindow = useCallback(({ title, children }: WindowInitProps) => {
    const windowID = windows.length;
    const newWindow = (
      <Window title={title} id={windowID} key={windowID}>
        {children}
      </Window>
    );

    setWindows(prev => {
      return [...prev, newWindow];
    });
    bringToFront(windowID);

    return windowID;
  }, [windows, bringToFront]);

  return (
    <WindowContext.Provider value={{ startWindow, bringToFront, getZIndex }}>
      {windows.map((window, _) => {
        return window;
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
