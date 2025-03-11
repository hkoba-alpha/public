export declare class FamAPU {
    private readonly module;
    private static instance;
    private irqCallback;
    private dmcCallback;
    private constructor();
    static getAPU(): Promise<FamAPU>;
    setDmcCallback(callback?: (addr: number) => number): void;
    setIrqCallback(callback?: (flag: number) => void): void;
    writeMem(addr: number, data: number): void;
    readMem(addr: number): number;
    /**
     * 1step(=240Hz)分の処理を行う
     * @param samples 1stepあたりのサンプル数（44100Hz=183 or 184, 48000Hz=200）
     */
    step(samples: number): Uint8Array;
    /**
     * 0-255のボリュームの大きさを設定する
     * @param volume 0-255の範囲
     */
    setVolume(volume: number): void;
    reset(): void;
    powerOff(): void;
}
