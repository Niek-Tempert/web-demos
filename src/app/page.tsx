"use client";
import Window from '@/components/os/window/window';
import { WindowManager } from '@/components/os/window/window-manager';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Page() {
  const [isVisible, setIsVisible] = useState(true);
  const [isVisible1, setIsVisible1] = useState(true);

  const onClick = () => {
    setIsVisible(prev => !prev);
  };

  const onClick1 = () => {
    setIsVisible1(prev => !prev);
  };

  const onVisibleChange = (isVisible: boolean) => {
    setIsVisible(isVisible);
  }

    const onVisibleChange1 = (isVisible: boolean) => {
    setIsVisible1(isVisible);
  }

  return (
    <div style={{ overflow: 'hidden', height: '100vh', width: '100vw' }}>
      <WindowManager>
        <Window title='📄 Form' position={{ x: 100, y: 50 }} visibilityCallback={[isVisible1, setIsVisible1]}>
          <div className="flex h-full">
            <div className="m-auto">
              <Input>
              </Input>
            </div>
          </div>
        </Window>
        <Window title='🚀 SpaceGame' position={{ x: 800, y: 300 }} visibilityCallback={[isVisible, setIsVisible]}>
          <iframe
            src="./spacegame/index.html"
            style={{
              width: '100%',
              height: '100%',
              margin: 'auto'
            }} />
        </Window>
      </WindowManager>
      <div className="absolute bottom-0 w-full h-10 bg-[#1F1F23] border-t border-[#464647] z-[10000] text-center flex items-center justify-center text-xl">
        <button className="taskbar-btn">🚪</button>
        <button onClick={onClick} className="taskbar-btn">🚀</button>
        <button onClick={onClick1} className="taskbar-btn">📄</button>
      </div>
      <img
        draggable={false}
        style={{
          width: '100vw',
          userSelect: 'none'
        }}
        src={'./os/wallpaper.webp'}
        alt={"Background"} />
    </div>
  );
}
