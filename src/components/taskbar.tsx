export default function Taskbar() {
    return (
        <div id="taskbar" style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '3.7vh',
            background: '#1F1F23',
            borderTop: '1px solid #464647',
            zIndex: 1000
        }} />
    );
};
