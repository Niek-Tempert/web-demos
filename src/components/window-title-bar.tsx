import { Minus, Copy, X } from "lucide-react";
import { RefObject } from "react";

interface WindowTitleBarProps {
    title?: string, 
    ref?: RefObject<HTMLDivElement | null>,
}

export default function WindowTitleBar({ title = "Window", ref }: WindowTitleBarProps) {

    const handleWindowBtn = (e: React.MouseEvent) => {
        // bringToFront(windowId);
        e.stopPropagation();
    };

    return (
        <div
            ref={ref}
            // onMouseDown={handleDragDown}
            style={{
                width: '100%',
                height: 34,
                display: 'flex',
                flexShrink: 0,
            }}>
            <p
                style={{
                    padding: 4,
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: 10,
                }}>
                {title}
            </p>
            <div className="grid flex-grow"></div>
            <div
                onMouseDown={handleWindowBtn}
                className='window-btn'
                style={{
                    width: 34,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Minus style={{ scale: 0.6 }} />
            </div>
            <div
                onMouseDown={handleWindowBtn}
                className='window-btn'
                style={{
                    width: 34,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Copy style={{ scale: 0.5, transform: 'rotate(90deg)' }} />
            </div>
            <div
                onMouseDown={handleWindowBtn}
                className='window-close-btn'
                style={{
                    width: 34,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <X style={{ scale: 0.6 }} /></div>
        </div>
    );
}