import { Minus, Copy, X, Square } from "lucide-react";
import { RefObject } from "react";

interface WindowTitleBarProps {
    title?: string;
    ref?: RefObject<HTMLDivElement | null>;
    isMaximized?: boolean;
    onMinimize?: (e: React.MouseEvent) => void;
    onMaximize?: (e: React.MouseEvent) => void;
    onClose?: (e: React.MouseEvent) => void;
}

export default function WindowTitleBar({
    title = "Window",
    ref,
    isMaximized = false,
    onMinimize,
    onMaximize,
    onClose,
}: WindowTitleBarProps) {

    return (
        <div
            ref={ref}
            style={{
                width: '100%',
                height: 34,
                display: 'flex',
                flexShrink: 0,
            }}>
            <p
                style={{
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: 4,
                }}>
                {title}
            </p>
            <div className="grid flex-grow"></div>
            <div
                className='window-btn'
                onClick={onMinimize}
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
                className='window-btn'
                onClick={onMaximize}
                style={{
                    width: 34,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                {isMaximized
                    ? <Copy style={{ scale: 0.5, transform: 'rotate(90deg)' }} />
                    : <Square style={{ scale: 0.5 }} />}
            </div>
            <div
                className='window-close-btn'
                onClick={onClose}
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