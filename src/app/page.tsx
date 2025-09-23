import Taskbar from '@/components/taskbar';
import Window from '@/components/window';
import { WindowManager } from '@/components/window-manager';

export default function Page() {
  return (
    <div id='page' style={{ overflow: 'hidden', height: '100vh', width: '100vw' }}>
        <WindowManager>
            <Window title='Empty' position={{x: 100, y: 100}}/>
            <Window title='SpaceGame' position={{x: 1000, y: 400}}>
                <iframe id="mygame-iframe" src="./game.html" style={{width: '100%', height: '100%', margin: 'auto'}}></iframe>
            </Window>
        </WindowManager>
        <Taskbar/>
        <img style={{ width: '100vw' }} src={'./wallpaper.webp'} alt={"Background"} />
    </div>
  );
}
