export class FamAPU {
    module;
    static instance;
    irqCallback = 0;
    dmcCallback = 0;
    constructor(module) {
        this.module = module;
    }
    static async getAPU() {
        if (!this.instance) {
            const wasmModule = await import('./wasm/apu.js');
            const module = await wasmModule.default();
            this.instance = new FamAPU(module);
        }
        return this.instance;
    }
    setDmcCallback(callback) {
        if (this.dmcCallback) {
            this.module.removeFunction(this.dmcCallback);
        }
        if (callback) {
            this.dmcCallback = this.module.addFunction(callback, 'ii');
            this.module._setDmcCallback(this.dmcCallback);
        }
    }
    setIrqCallback(callback) {
        if (this.irqCallback) {
            this.module.removeFunction(this.irqCallback);
        }
        if (callback) {
            this.irqCallback = this.module.addFunction(callback, 'vi');
            this.module._setIrqCallback(this.irqCallback);
        }
    }
    writeMem(addr, data) {
        this.module._writeMem(addr, data);
    }
    readMem(addr) {
        return this.module._readMem(addr);
    }
    /**
     * 1step(=240Hz)分の処理を行う
     * @param samples 1stepあたりのサンプル数（44100Hz=183 or 184, 48000Hz=200）
     */
    step(samples) {
        const buf = this.module._step(samples);
        return new Uint8Array(this.module.HEAPU32.buffer, buf, samples);
    }
    /**
     * 0-255のボリュームの大きさを設定する
     * @param volume 0-255の範囲
     */
    setVolume(volume) {
        this.module._setVolume(volume);
    }
    reset() {
        this.module._reset();
    }
    powerOff() {
        this.module._powerOff();
    }
}
