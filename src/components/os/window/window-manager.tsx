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
  minimize: (windowID: number) => void;
  focus: (windowID: number) => void;
  getZIndex: (windowID: number) => number;
  getIsVisible: (windowID: number) => boolean;
}

const WindowContext = createContext<WindowContextType | null>(null);

export function WindowManager({ children }: { children?: React.ReactNode }) {
  const [windows, setWindows] = useState<React.ReactNode[]>([]);
  const [windowOrder, setWindowOrder] = useState<number[]>([]);
  const [minimized, setMinimized] = useState<number[]>([]);
  const baseZIndex = 1000;

  const bringToFront = useCallback((windowID: number) => {
    setWindowOrder(prev => {
      const filtered = prev.filter(id => id !== windowID);
      return [...filtered, windowID];
    });
  }, []);

  const minimize = useCallback((windowID: number) => {
    setMinimized(prev => {
      const filtered = prev.filter(id => id !== windowID);
      return [...filtered, windowID];
    });
  }, []);

  const focus = useCallback((windowID: number) => {
    setMinimized(prev => {
      const filtered = prev.filter(id => id !== windowID);
      return [...filtered];
    });
    bringToFront(windowID);
  }, [bringToFront]);

  const getZIndex = useCallback((windowID: number) => {
    const index = windowOrder.indexOf(windowID);
    return index === -1 ? baseZIndex : baseZIndex + index + 1;
  }, [windowOrder]);

  const getIsVisible = useCallback((windowID: number) => {
    return !minimized.includes(windowID);
  }, [minimized]);

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
    <WindowContext.Provider value={{ startWindow, bringToFront, minimize, focus, getZIndex, getIsVisible }}>
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
