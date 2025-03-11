export declare class FamPPU {
    private readonly module;
    private vblankCallback;
    private hblankCallback;
    private cpuCallback;
    private static instance;
    private constructor();
    static getPPU(): Promise<FamPPU>;
    setVblankCallback(callback?: () => void): void;
    setHblankCallback(callback?: (y: number) => void): void;
    setCpuCallback(callback?: (cycle: number) => void): void;
    /**
     * 画面をレンダリングする
     * @param clip 上下8ドットずつをクリップするかどうか
     * @returns レンダリングされた画面のピクセルデータ
     */
    renderScreen(clip?: boolean): Uint8ClampedArray;
    writeMem(addr: number, data: number): void;
    readMem(addr: number): number;
    writeVram(addr: number, data: number): void;
    readVram(addr: number): number;
    writeSprite(addr: number, data: number): void;
    /**
     * ミラーモードを設定するメソッド
     * @param mode 0: 1画面 lower, 1: １画面 upper, 2:垂直ミラー, 3:水平ミラー, 4:4画面
     */
    setMirrorMode(mode: number): void;
    reset(): void;
    powerOff(): void;
}
