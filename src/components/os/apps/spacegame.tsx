import Window from "../window/window";

export default function SpaceGame() {
    return (
        <Window title='🚀 SpaceGame' position={{ x: 800, y: 300 }}>
        <iframe
            src="./spacegame/index.html"
            style={{
                width: '100%',
                height: '100%',
                margin: 'auto'
            }} />
        </Window>
    );
}