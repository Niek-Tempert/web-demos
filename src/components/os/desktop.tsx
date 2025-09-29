import SpaceGame from "./apps/spacegame";
import { useWindowManager } from "./window/window-manager";
import Window from "./window/window";
import Empty from "./apps/empty";
import Form from "./apps/form";

export default function Desktop() {
    const { startWindow, focusWindow } = useWindowManager();

    const handleStartWindow = (e: React.MouseEvent, content: React.ReactNode) => {
        if (!(e.target instanceof HTMLElement)) return;

        const windowID = e.target.getAttribute('w-id');
        if (!windowID) {
            const windowIndex = startWindow({
                children: content
            });

            e.target.setAttribute('w-id', windowIndex.toString());
            return;
        }

        const windowIndex = parseInt(windowID);
        if (!windowIndex) return;

        focusWindow(windowIndex);
    };

    return (
        <>
            <div className="absolute bottom-0 w-full h-10 bg-[#1F1F23] border-t border-[#464647] z-[10000] text-center flex items-center justify-center text-xl">
                <button onClick={(e: React.MouseEvent) => handleStartWindow(e, <Empty></Empty>)} className="taskbar-btn">🚪</button>
                <button onClick={(e: React.MouseEvent) => handleStartWindow(e, <SpaceGame />)} className="taskbar-btn">🚀</button>
                <button onClick={(e: React.MouseEvent) => handleStartWindow(e, <Form></Form>)} className="taskbar-btn">📄</button>
            </div>
            <img
                draggable={false}
                style={{
                    width: '100vw',
                    userSelect: 'none'
                }}
                src={'./os/wallpaper.webp'}
                alt={"Background"} />
        </>
    );
}