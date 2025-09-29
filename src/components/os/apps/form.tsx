import { Input } from "@/components/ui/input";
import Window from "../window/window";

export default function Form() {
    return (
        <Window title='📄 Form' position={{ x: 100, y: 50 }}>
            <div className="flex h-full">
                <div className="m-auto">
                    <Input>
                    </Input>
                </div>
            </div>
        </Window>
    );
}