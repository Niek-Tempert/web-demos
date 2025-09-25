import Taskbar from '@/components/taskbar';
import Window from '@/components/window';
import { WindowManager } from '@/components/window-manager';

export default function Page() {
  return (
    <div id='page' style={{ overflow: 'hidden', height: '100vh', width: '100vw' }}>
      <WindowManager>
        <Window title='Empty' position={{ x: 100, y: 50 }} />
        <Window title='SpaceGame' position={{ x: 800, y: 300 }}>
          <iframe
            src="./game.html"
            style={{
              width: '100%',
              height: '100%',
              margin: 'auto'
            }} />
        </Window>
      </WindowManager>
      <Taskbar />
      <img
        draggable={false}
        style={{
          width: '100vw',
          userSelect: 'none'
        }}
        src={'./wallpaper.webp'}
        alt={"Background"} />
    </div>
  );
}
