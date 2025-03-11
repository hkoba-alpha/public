export class FamCPU {
    module;
    static instance;
    apuStepCallback = 0;
    memReadCallback = 0;
    memWriteCallback = 0;
    debugCallback = 0;
    constructor(module) {
        this.module = module;
    }
    static async getCPU() {
        if (!this.instance) {
            const wasmModule = await import('./wasm/cpu.js');
            const module = await wasmModule.default();
            this.instance = new FamCPU(module);
        }
        return this.instance;
    }
    nmi() {
        this.module._nmi();
    }
    reset() {
        this.module._reset();
    }
    powerOff() {
        this.module._powerOff();
    }
    irq(flag = 1) {
        this.module._irq(flag);
    }
    skip(cycle) {
        this.module._skip(cycle);
    }
    step(cycle) {
        return this.module._step(cycle);
    }
    setApuStepCallback(callback) {
        if (this.apuStepCallback) {
            this.module.removeFunction(this.apuStepCallback);
        }
        if (callback) {
            this.apuStepCallback = this.module.addFunction(callback, 'vi');
            this.module._setApuStepCallback(this.apuStepCallback);
        }
        else {
            this.apuStepCallback = 0;
        }
    }
    setMemReadCallback(callback) {
        if (this.memReadCallback) {
            this.module.removeFunction(this.memReadCallback);
        }
        if (callback) {
            this.memReadCallback = this.module.addFunction(callback, 'ii');
            this.module._setMemReadCallback(this.memReadCallback);
        }
        else {
            this.memReadCallback = 0;
        }
    }
    setMemWriteCallback(callback) {
        if (this.memWriteCallback) {
            this.module.removeFunction(this.memWriteCallback);
        }
        if (callback) {
            this.memWriteCallback = this.module.addFunction(callback, 'vii');
            this.module._setMemWriteCallback(this.memWriteCallback);
        }
        else {
            this.memWriteCallback = 0;
        }
    }
    setDebugCallback(callback) {
        if (this.debugCallback) {
            this.module.removeFunction(this.debugCallback);
        }
        if (callback) {
            this.debugCallback = this.module.addFunction(callback, 'viiiiiii');
            this.module._setDebugCallback(this.debugCallback);
        }
        else {
            this.debugCallback = 0;
        }
    }
    getOperandText(addr) {
        const next = this.module._makeOperandText(addr);
        const buf = this.module._getOperandText();
        const bytes = new Uint8Array(this.module.HEAPU8.buffer, buf);
        let length = 0;
        while (bytes[length] !== 0)
            length++;
        const text = new TextDecoder().decode(bytes.subarray(0, length));
        return [text, next];
    }
}
