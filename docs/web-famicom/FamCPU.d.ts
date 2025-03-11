export declare class FamCPU {
    private readonly module;
    private static instance;
    private apuStepCallback;
    private memReadCallback;
    private memWriteCallback;
    private debugCallback;
    private constructor();
    static getCPU(): Promise<FamCPU>;
    nmi(): void;
    reset(): void;
    powerOff(): void;
    irq(flag?: number): void;
    skip(cycle: number): void;
    step(cycle: number): number;
    setApuStepCallback(callback?: (cycle: number) => void): void;
    setMemReadCallback(callback?: (addr: number) => number): void;
    setMemWriteCallback(callback?: (addr: number, data: number) => void): void;
    setDebugCallback(callback?: (a: number, x: number, y: number, s: number, p: number, pc: number, cycle: number) => void): void;
    getOperandText(addr: number): [string, number];
}
