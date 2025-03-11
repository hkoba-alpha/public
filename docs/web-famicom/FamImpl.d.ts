import { IFamCanvas, IFamPad, IFamSound, Mapper, NesFile, PadButton } from "./NesFile";
export declare class PPUCanvas implements IFamCanvas {
    private element;
    private context;
    private image;
    private clip;
    private adjust?;
    constructor(element: HTMLCanvasElement);
    powerOff(): void;
    render(image: Uint8ClampedArray): void;
    isClip(): boolean;
}
export declare class PPUCanvasWebGL implements IFamCanvas {
    private gl;
    private program;
    private texture;
    private buffer;
    private vertexArray;
    private clip;
    private height;
    constructor(element: HTMLCanvasElement);
    powerOff(): void;
    private createShaderProgram;
    private compileShader;
    private createTexture;
    private createBuffer;
    render(image: Uint8ClampedArray): void;
    isClip(): boolean;
}
export declare const player1Buttons: {
    [button: number]: string[];
};
export declare class KeyboardPad implements IFamPad {
    private static pushKeyMap;
    private static isPressed;
    private buttonMap;
    constructor(buttons?: {
        [button: number]: string[];
    });
    getButton(button: PadButton): boolean;
}
export declare class WorkerSound implements IFamSound {
    private apuNode;
    private static instance;
    static getSound(): Promise<WorkerSound>;
    samples: number;
    private constructor();
    play(data: Uint8Array): void;
}
export declare class Mapper0 extends Mapper {
    private constructor();
    static create(nes: NesFile): Mapper;
    protected writeRom(addr: number, data: number): void;
    protected initRom(): void;
}
export declare class Mapper1 extends Mapper {
    private count;
    private data;
    /**
     * 0-1: ミラーリング(0=)
     * 2: PRGバンク固定: 0-8000切り替え, 1-c000切り替え
     * 3: PRG単位: 0-32k, 1-16k
     * 4: CHR単位: 0-8k, 1-4k
     */
    private mode;
    private pageInfo;
    static create(nes: NesFile): Mapper;
    private constructor();
    protected initRom(): void;
    protected writeRom(addr: number, data: number): void;
    private selectPrgPage;
}
