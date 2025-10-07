import SpaceGame from "./apps/spacegame";
import { useWindowManager } from "./window/window-manager";
import Empty from "./apps/empty";
import Form from "./apps/form";
import { useCallback } from "react";
import Artstation from "./apps/artstation";

export default function Desktop() {
    const { startWindow, focus } = useWindowManager();

    const handleStartWindow = useCallback((e: React.MouseEvent, content: React.ReactNode) => {
        if (!(e.target instanceof HTMLElement)) return;

        const windowID = e.target.getAttribute('w-id');
        const windowIndex = parseInt(windowID ?? "");
        if (isNaN(windowIndex)) {
            const windowIndex = startWindow({
                children: content
            });

            e.target.setAttribute('w-id', windowIndex.toString());
            return;
        }

        focus(windowIndex);
    }, [startWindow, focus]);

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 w-full h-10 bg-[#1F1F23] border-t border-[#464647] z-[10000] text-center flex items-center justify-center text-xl">
                <button className="taskbar-btn" onClick={(e: React.MouseEvent) => handleStartWindow(e, <Empty />)}>🚪</button>
                <button className="taskbar-btn" onClick={(e: React.MouseEvent) => handleStartWindow(e, <SpaceGame />)}>🚀</button>
                <button className="taskbar-btn" onClick={(e: React.MouseEvent) => handleStartWindow(e, <Form />)}>📄</button>
                <button className="taskbar-btn" onClick={(e: React.MouseEvent) => handleStartWindow(e, <Artstation />)}>🖌️</button>
                {/* <a className="taskbar-btn" target="_blank" href="https://www.artstation.com/niektempert">🖌️</a> */}
            </div>
            <img
                className="wallpaper"
                draggable={false}
                style={{
                    userSelect: 'none'
                }}
                src={'./os/wallpaper.webp'}
                alt={"Background"} />
        </>
    );
}